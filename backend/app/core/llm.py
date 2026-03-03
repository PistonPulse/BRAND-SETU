"""
LLM Provider Factory — returns a primary (Groq) or fallback (AWS Bedrock) chat model.

─────────────────────────────────────────────────────────────────────────────
WHAT
    A single factory function (`get_llm`) that instantiates LangChain
    chat-model objects.  All API keys are read from the `Settings` singleton
    via `.get_secret_value()`, so **no secret is ever hard-coded**.

HOW  — Factory Pattern
    The caller passes a `model_role` string ("primary" or "fallback") and
    receives back a fully-configured LangChain `BaseChatModel`.  Internally
    the function branches to the right provider class.

    This pattern gives us:
      1. A single import / call-site for every LangGraph agent node.
      2. Easy A/B experimentation — just flip the role string.
      3. Resilience — if Groq rate-limits or goes down, any agent can
         request the "fallback" role and transparently switch to AWS
         Bedrock without changing any prompt or chain logic.

WHY two providers?
    • Groq   → Ultra-fast inference on custom LPU silicon; ideal for the
                latency-sensitive content-generation loop.
    • Bedrock → Highly available, enterprise-grade AWS infra running
                Anthropic Claude / Amazon Titan models; acts as the
                safety net when the primary API is unavailable.
─────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_groq import ChatGroq        # pip install langchain-groq
from langchain_aws import ChatBedrock      # pip install langchain-aws

from app.core.config import get_settings


# ─────────────────────────────────────────────────────────────────────────────
# Public factory
# ─────────────────────────────────────────────────────────────────────────────

def get_llm(model_role: str = "primary") -> BaseChatModel:
    """Return a configured LangChain chat model based on the requested role.

    Parameters
    ----------
    model_role : str, default "primary"
        • ``"primary"``  → Groq  (Llama-3.3-70B, temperature 0.7)
        • ``"fallback"`` → AWS Bedrock  (Claude 3 Haiku)

    Returns
    -------
    BaseChatModel
        A LangChain-compatible chat model ready to be plugged into any
        chain, agent, or LangGraph node.

    Raises
    ------
    ValueError
        If an unrecognised ``model_role`` is supplied.

    Why a factory?
        LangGraph agent nodes don't need to know *which* provider they're
        talking to.  They just call ``get_llm()`` (or ``get_llm("fallback")``)
        and receive a model that satisfies the BaseChatModel interface.
        If Groq rate-limits us, we can seamlessly swap to Bedrock by
        changing one argument — zero prompt or chain rewiring required.
    """

    # ── Load validated settings (singleton, cached) ──────────
    settings = get_settings()

    # ── PRIMARY: Groq ────────────────────────────────────────
    if model_role == "primary":
        # WHAT:  Instantiate the Groq-hosted Llama-3.3-70B model.
        # HOW:   The API key is stored as a Pydantic `SecretStr` in Settings.
        #        `.get_secret_value()` extracts the raw string at the last
        #        possible moment, so the key never appears in logs or repr().
        # WHY 0.7 temperature:  Gives the content-generation agents enough
        #        creativity for marketing copy while keeping outputs coherent.
        return ChatGroq(
            api_key=settings.GROQ_API_KEY.get_secret_value(),
            model=settings.DEFAULT_GROQ_MODEL,       # "llama-3.3-70b-versatile"
            temperature=0.7,
            max_tokens=settings.LLM_MAX_TOKENS,       # 4096 by default
        )

    # ── FALLBACK: AWS Bedrock ────────────────────────────────
    if model_role == "fallback":
        # WHAT:  Instantiate an AWS Bedrock-hosted model as a resilience
        #        fallback when the primary Groq endpoint is unavailable or
        #        rate-limited.
        #
        # MODEL CHOICE:
        #   Using "anthropic.claude-3-haiku-20240307-v1:0" — the fastest
        #   and most cost-effective Claude 3 variant on Bedrock.
        #   Alternative: "amazon.titan-text-express-v1" if you prefer a
        #   first-party AWS model with no additional EULA.
        #
        # AWS CREDENTIALS:
        #   ChatBedrock relies on boto3's default credential chain:
        #     1. Environment variables  (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)
        #     2. Shared credential file (~/.aws/credentials)
        #     3. IAM instance role (EC2 / ECS / Lambda)
        #   In production, prefer IAM Roles so no long-lived keys exist.
        #   For local development, our Settings class loads the keys from
        #   .env into the process environment, where boto3 picks them up
        #   implicitly — no need to pass them to ChatBedrock explicitly.
        return ChatBedrock(
            model_id="anthropic.claude-3-haiku-20240307-v1:0",
            region_name=settings.AWS_DEFAULT_REGION,       # "us-east-1"
            model_kwargs={
                "temperature": 0.7,
                "max_tokens": settings.LLM_MAX_TOKENS,     # 4096
            },
            credentials_profile_name=None,  # None → use env vars / IAM role
        )

    # ── Unknown role ─────────────────────────────────────────
    raise ValueError(
        f"Unknown model_role '{model_role}'. Expected 'primary' or 'fallback'."
    )
