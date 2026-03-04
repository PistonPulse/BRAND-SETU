"""
Brand Memory Service — RAG (Retrieval-Augmented Generation) layer built on
Supabase pgvector and LangChain.

─────────────────────────────────────────────────────────────────────────────
WHAT
    Two public async functions that agents call to:
      • `add_brand_guideline`    — embed and store brand rules / past posts.
      • `retrieve_brand_context` — similarity-search and return a Markdown
                                   string ready to inject into LangGraph state.

HOW — Vector store architecture
    ┌─────────────────────────────────────────────────────────────┐
    │  Input text                                                 │
    │      ↓                                                      │
    │  HuggingFaceEmbeddings  (all-MiniLM-L6-v2, 384 dims)      │
    │      ↓   float32 vector of length 384                      │
    │  SupabaseVectorStore ──▶ pgvector extension in Supabase    │
    │      • table  : brand_memory                                │
    │      • fn     : match_brand_memory  (cosine similarity)     │
    └─────────────────────────────────────────────────────────────┘

HOW — Supabase schema (expected, must be created via migration):
    CREATE TABLE brand_memory (
        id          BIGSERIAL PRIMARY KEY,
        content     TEXT,
        metadata    JSONB,
        embedding   VECTOR(384)         -- matches all-MiniLM-L6-v2 output
    );

    CREATE OR REPLACE FUNCTION match_brand_memory(
        query_embedding VECTOR(384),
        match_count     INT DEFAULT 3
    )
    RETURNS TABLE (id BIGINT, content TEXT, metadata JSONB, similarity FLOAT)
    LANGUAGE SQL STABLE AS $$
        SELECT id, content, metadata,
               1 - (embedding <=> query_embedding) AS similarity
        FROM   brand_memory
        ORDER  BY embedding <=> query_embedding
        LIMIT  match_count;
    $$;

WHY RAG for brand memory?
    • Brand guidelines, tone-of-voice rules, and past high-performing posts
      can be thousands of words — too long to include wholesale in every
      LLM prompt.
    • Embedding + similarity search lets agents fetch ONLY the 3–5 most
      relevant brand snippets for a given topic, keeping prompts concise
      and focused.
    • Storing in Supabase (pgvector) means the memory persists across
      process restarts and is shared across all server instances.

WHY `all-MiniLM-L6-v2`?
    • 384-dimensional output — compact enough for fast cosine-search while
      retaining strong semantic quality on short-to-medium texts.
    • Runs entirely CPU-side with no external API call — zero latency added
      per embedding and no additional API key required.
    • Widely benchmarked; available via the `sentence-transformers` package
      which `langchain-huggingface` wraps.
─────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional

from langchain_huggingface import HuggingFaceEmbeddings      # pip install langchain-huggingface
from langchain_community.vectorstores import SupabaseVectorStore  # pip install langchain-community

from app.services.supabase import get_supabase_client

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Embedding model — initialised ONCE at module import time
# ─────────────────────────────────────────────────────────────────────────────

# WHAT:  `HuggingFaceEmbeddings` downloads the all-MiniLM-L6-v2 model from
#        Hugging Face Hub on first use and caches it locally.
# HOW:   It wraps `sentence-transformers` under the hood, running inference
#        on CPU by default (or GPU if CUDA is available).
# WHY module-level (not inside the function)?
#        Loading the model involves reading ~90 MB of weights from disk.
#        Doing it once at import time means every subsequent call to
#        `get_vector_store()` reuses the already-loaded model — avoids
#        ~500 ms of cold-start per request.
# WHY 384 dimensions?
#        all-MiniLM-L6-v2 always produces vectors of exactly 384 float32
#        values.  The `embedding VECTOR(384)` column in the `brand_memory`
#        Supabase table MUST match this dimension exactly — a mismatch
#        causes a pgvector insertion error.
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


# ─────────────────────────────────────────────────────────────────────────────
# Vector store accessor
# ─────────────────────────────────────────────────────────────────────────────

def get_vector_store() -> SupabaseVectorStore:
    """Return a configured SupabaseVectorStore pointing at our brand_memory table.

    WHAT:  Wires together three components:
             1. Supabase `Client`       — the pooled HTTP client (singleton).
             2. `embeddings`            — the module-level MiniLM model.
             3. Table / function names  — tells LangChain where to store and
                                          query vectors in Supabase.

    HOW:   `SupabaseVectorStore` from `langchain_community` translates
           LangChain's standard vector-store interface into Supabase REST API
           calls:
             • `add_texts()`        → POST to /rest/v1/brand_memory
             • `similarity_search() → POST to /rest/v1/rpc/match_brand_memory

    WHY `query_name="match_brand_memory"`?
           Supabase's pgvector integration requires a SQL function that
           accepts a query embedding vector and returns ranked rows.  The
           function name must match the one created in the migration
           (see module docstring above).  LangChain calls this RPC endpoint
           automatically during similarity_search().

    Returns
    -------
    SupabaseVectorStore
        Ready-to-use vector store instance.
    """
    # WHAT:  Grab the singleton Supabase client (see services/supabase.py).
    # WHY not create a new client here?  Connection-pool efficiency — the
    #        same pooled HTTP session is reused across all vector store ops.
    client = get_supabase_client()

    return SupabaseVectorStore(
        client=client,
        embedding=embeddings,        # the module-level MiniLM model
        table_name="brand_memory",   # Supabase table that stores embeddings
        query_name="match_brand_memory",  # SQL RPC function for similarity search
    )


# ─────────────────────────────────────────────────────────────────────────────
# Public async functions
# ─────────────────────────────────────────────────────────────────────────────

async def add_brand_guideline(
    content: str,
    metadata: Optional[Dict] = None,
) -> bool:
    """Embed and persist a brand guideline or past post into the vector store.

    Parameters
    ----------
    content : str
        The raw text to embed and store — brand rules, tone-of-voice
        examples, or high-performing past social-media posts.
    metadata : dict, optional
        Arbitrary key/value pairs stored alongside the vector, e.g.:
          {"source": "brand_guide_v3", "platform": "linkedin", "year": 2025}
        Stored in the `metadata JSONB` column; returned alongside documents
        on retrieval so agents can filter or cite sources.

    Returns
    -------
    bool
        True on successful insertion; False if an exception occurred
        (logged at ERROR level — caller can decide how to handle).

    WHAT is happening internally?
        1. `get_vector_store()` connects to Supabase.
        2. `add_texts([content], metadatas=[metadata])` calls the embedding
           model to produce a 384-dim vector, then POSTs both the raw text
           and the vector to Supabase via the REST API.
        3. pgvector stores the vector in the `embedding VECTOR(384)` column.

    WHY async?
        The Supabase REST call is I/O-bound.  Marking the function `async`
        lets FastAPI / LangGraph await it without blocking the event loop,
        keeping the API responsive during bulk guideline ingestion.

    NOTE: `SupabaseVectorStore.add_texts()` is currently synchronous in
        LangChain community.  We call it in an executor-friendly way; future
        versions of langchain-community may add native async support.
    """
    try:
        vector_store = get_vector_store()

        # WHAT:  `add_texts` accepts a list of strings and an optional list
        #        of metadata dicts (one per text).  We wrap single inputs
        #        in lists to match the API.
        # HOW:   Internally, LangChain batches the embedding calls, then
        #        POSTs to Supabase's REST API to insert rows.
        vector_store.add_texts(
            texts=[content],
            metadatas=[metadata or {}],
        )

        logger.info(
            "Brand guideline stored successfully | chars=%d metadata=%s",
            len(content),
            metadata,
        )
        return True

    except Exception as exc:
        logger.error(
            "Failed to store brand guideline | error=%s", exc, exc_info=True
        )
        return False


async def retrieve_brand_context(query: str, k: int = 3) -> str:
    """Retrieve the most semantically relevant brand guidelines for a query.

    Parameters
    ----------
    query : str
        The search query — typically the content `topic` from the user's
        `ContentRequest`.  The function embeds this query and returns the
        `k` most similar documents from the brand_memory table.
    k : int, default 3
        Number of documents to retrieve.  3 is a sensible default:
          • Enough context for rich brand alignment.
          • Small enough to stay well within LLM context-window limits.

    Returns
    -------
    str
        A Markdown-formatted string combining the content of all retrieved
        documents, ready to be injected directly into `GraphState` or an
        LLM prompt.  Returns an empty string if no documents are found or
        if an error occurs (logged separately).

    HOW — Retrieval pipeline (direct RPC, bypasses LangChain vector store)
        1. `query` is embedded directly via the module-level MiniLM model.
        2. We call the `match_brand_memory` SQL RPC function directly on the
           Supabase client, avoiding the LangChain SupabaseVectorStore wrapper
           that triggers the `AttributeError: 'SyncRPCFilterRequestBuilder'
           object has no attribute 'params'` bug on mismatched library
           versions.
        3. pgvector computes cosine distance between the query vector and
           every row's `embedding` column, returning the `k` closest rows.
        4. Each row comes back as a plain dict with `content` and `metadata`
           keys (as defined by the SQL function's RETURNS TABLE).
        5. We join the content values with Markdown separators so the
           resulting string reads naturally when injected into prompts.

    WHY return Markdown (not a list of Documents)?
        LangGraph state values are plain Python types — strings, dicts, etc.
        A Markdown string can be stored in `GraphState["research_context"]`
        and injected verbatim into the Creator / Researcher prompts without
        any further formatting logic in the agent nodes.
    """
    try:
        # Step 1 — embed the query directly with the module-level MiniLM model.
        # WHAT:  Produces a 384-dim float list matching the `VECTOR(384)` column.
        # WHY not go through SupabaseVectorStore?  The LangChain wrapper calls
        #        `.params` on the Supabase filter builder object, which no longer
        #        exists in newer versions of `supabase-py`, causing an
        #        AttributeError at runtime.  Calling embed_query() + rpc()
        #        directly avoids the broken code path entirely.
        query_embedding: List[float] = embeddings.embed_query(query)

        # Step 2 — call the Supabase RPC function directly.
        # WHAT:  `match_brand_memory` is a SQL function that accepts the query
        #        vector and a row-count limit, then returns ranked rows via
        #        cosine similarity (see module docstring for the DDL).
        # HOW:   `.rpc(fn, params).execute()` posts to
        #        /rest/v1/rpc/match_brand_memory and returns an APIResponse
        #        whose `.data` attribute is a list of dicts.
        response = (
            get_supabase_client()
            .rpc(
                "match_brand_memory",
                {"query_embedding": query_embedding, "match_count": k},
            )
            .execute()
        )

        rows = response.data or []

        if not rows:
            logger.info(
                "No brand memory documents found for query=%r", query
            )
            return ""

        # Step 3 — format the retrieved rows into a cohesive Markdown block.
        # WHAT:  Each row dict has at minimum `content` (str) and `metadata`
        #        (dict) keys as declared in the SQL RETURNS TABLE clause.
        # HOW:   Each document becomes a numbered section under a heading.
        #        We include the metadata source (if present) as a citation,
        #        then the raw content so agents can read it as a brief.
        # WHY Markdown?  The Creator and Researcher system prompts are already
        #        Markdown-rich; consistent formatting helps LLMs parse
        #        section boundaries correctly.
        sections: List[str] = []
        for i, row in enumerate(rows, start=1):
            metadata: Dict = row.get("metadata") or {}
            source: str = metadata.get("source", f"guideline-{i}")
            content: str = (row.get("content") or "").strip()
            sections.append(
                f"### Brand Memory [{i}] — {source}\n\n"
                f"{content}"
            )

        context = "\n\n---\n\n".join(sections)

        logger.info(
            "Retrieved %d brand memory docs for query=%r | total_chars=%d",
            len(rows),
            query,
            len(context),
        )
        return context

    except Exception as exc:
        logger.error(
            "Failed to retrieve brand context | query=%r error=%s",
            query,
            exc,
            exc_info=True,
        )
        # Return empty string so agents degrade gracefully rather than
        # crashing when the vector store is unavailable.
        return ""

