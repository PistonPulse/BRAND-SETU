"""
Content-generation endpoint — the public entry point for the multi-agent pipeline.

─────────────────────────────────────────────────────────────────────────────
WHAT
    Exposes a single POST /generate route that accepts a validated
    `ContentRequest`, runs it through the compiled LangGraph workflow
    (Researcher → Creator → Sentinel with revision loops), and returns a
    structured `ContentResponse` with per-platform drafts and image prompts.

HOW
    1. FastAPI validates the JSON body against `ContentRequest` (Pydantic)
       before our code even runs — malformed or over-sized payloads are
       rejected at the framework layer with a 422 response.
    2. `Depends(verify_api_key)` checks the `X-API-Key` header in
       constant time before the route handler body executes.
    3. We build a `GraphState`-typed initial state dict and hand it to
       `brand_agent_app.ainvoke()` — the precompiled LangGraph runnable.
    4. After the graph terminates (approved OR circuit-breaker), we map
       the final state into a `ContentResponse` DTO.

SECURITY HIGHLIGHTS
    1. API key guard (`verify_api_key` dependency)
       → Constant-time comparison prevents timing side-channel attacks.
       → Missing or wrong key → 403 before any LLM call is made.
    2. Input validation (`ContentRequest` Pydantic model)
       → `extra="forbid"` blocks mass-assignment.
       → `max_length` caps topic at 500 chars (prompt-injection mitigation).
       → `Literal` platforms whitelist prevents free-text injection.
    3. Exception boundary
       → Any unexpected error from the graph is caught here and returned
         as HTTP 500 — raw tracebacks never reach the client.
─────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import ContentRequest, ContentResponse
from app.core.security import verify_api_key
from app.graph.workflow import brand_agent_app
from app.graph.state import GraphState
from app.services.image_gen import generate_image_hf

logger = logging.getLogger(__name__)

router = APIRouter()


# ── Image Generation DTOs ────────────────────────────────────────────────────

class ImageGenerationRequest(BaseModel):
    """Request body for the /generate-image endpoint."""

    prompt: str
    #   The text description used to generate the image.
    #   Example: "A vibrant Diwali celebration, warm bokeh lights, photorealistic"


class ImageGenerationResponse(BaseModel):
    """Successful response from the /generate-image endpoint."""

    image_base64: str
    #   Raw image bytes encoded as base64.  Use in an <img> tag like:
    #   src="data:image/png;base64,<image_base64>"


# ── Image Generation Endpoint ────────────────────────────────────────────────

@router.post(
    "/generate-image",
    response_model=ImageGenerationResponse,
    summary="Generate an image from a text prompt via HuggingFace FLUX.1-schnell",
    description=(
        "Calls the free HuggingFace Serverless Inference API with the supplied "
        "prompt and returns the generated image as a base64-encoded string. "
        "Handles model cold-start (503) with up to 3 automatic retries. "
        "Requires a valid `X-API-Key` header."
    ),
)
async def generate_image(
    request: ImageGenerationRequest,
    _: str = Depends(verify_api_key),
) -> ImageGenerationResponse:
    """Generate an image from *request.prompt* using FLUX.1-schnell.

    Parameters
    ----------
    request : ImageGenerationRequest
        JSON body with a single ``prompt`` field.

    Returns
    -------
    ImageGenerationResponse
        ``image_base64`` — base64-encoded PNG/JPEG image bytes.
    """
    logger.info(
        "Image generation request received | prompt_length=%d",
        len(request.prompt),
    )

    try:
        base64_str = await generate_image_hf(request.prompt)
        return ImageGenerationResponse(image_base64=base64_str)

    except Exception as exc:
        logger.error(
            "Image generation failed | prompt=%r error=%s",
            request.prompt[:100],
            exc,
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Image generation encountered an unexpected error. "
                "Please try again or contact support."
            ),
        )


@router.post(
    "/generate",
    response_model=ContentResponse,
    summary="Generate multi-platform social-media content via the agent pipeline",
    description=(
        "Runs the full Researcher → Creator → Sentinel LangGraph workflow "
        "and returns platform-specific copy + image prompts. "
        "Requires a valid `X-API-Key` header."
    ),
)
async def generate_content(
    payload: ContentRequest,
    # WHAT:  `Depends(verify_api_key)` injects the security dependency.
    # HOW:   FastAPI resolves it before calling this function body.
    #        If the key is missing or wrong, FastAPI returns 403 immediately
    #        and this code never executes — zero LLM tokens wasted.
    # WHY underscore prefix?  The return value (the validated key string)
    #        is not needed inside the handler; the convention _ signals that.
    _: str = Depends(verify_api_key),
) -> ContentResponse:
    """Run the Researcher → Creator ⇄ Sentinel graph and return the final drafts.

    Parameters
    ----------
    payload : ContentRequest
        Validated request body containing `topic`, `platforms`,
        `tone_override`, and optional `seed_url`.

    Returns
    -------
    ContentResponse
        ``status``          — "success" | "partial_success" | "error"
        ``final_content``   — Dict[platform, Dict["text"/"image_prompt", str]]
        ``iteration_count`` — number of Creator drafts produced
    """
    logger.info(
        "Content generation request received | topic=%r platforms=%s",
        payload.topic,
        list(payload.platforms),
    )

    try:
        # ── 1. Build the initial GraphState ──────────────────────────────
        # WHAT:  A typed dict seeded with the user's request and zeroed
        #        counters.  LangGraph updates individual keys as nodes run.
        # HOW:   We pass it as a plain dict — GraphState is a TypedDict,
        #        so it is just a plain dict at runtime with type hints for
        #        IDE and mypy support.
        # WHY empty strings / False / 0 for the other keys?
        #        LangGraph merges partial state updates, so every key must
        #        exist in the initial state to avoid KeyError on the first
        #        `.get()` call inside any node.
        initial_state: GraphState = {
            "request":          payload,   # validated ContentRequest Pydantic obj
            "research_context": "",        # written by Researcher node
            "current_drafts":   {},        # written by Creator node
            "sentinel_feedback": "",       # written by Sentinel node
            "is_approved":      False,     # written by Sentinel node
            "loop_count":       0,         # incremented by Creator node
            "error":            None,      # populated on unrecoverable failure
            "metadata":         None,      # reserved for observability
        }

        # ── 2. Invoke the compiled LangGraph workflow ─────────────────────
        # WHAT:  `brand_agent_app` is the precompiled StateGraph — it was
        #        compiled once at module import time in workflow.py.
        # HOW:   `.ainvoke()` runs the graph asynchronously end-to-end and
        #        returns the final cumulative state dict after the last node
        #        (Researcher, Creator, or Sentinel) has executed.
        # WHY precompiled (not build_content_graph() per request)?
        #        Compilation validates the graph topology and is relatively
        #        expensive.  A module-level compiled graph is built once and
        #        shared across all requests — ~10× faster per-request.
        final_state: GraphState = await brand_agent_app.ainvoke(initial_state)

        # ── 3. Extract results from the final state ───────────────────────
        is_approved: bool   = final_state.get("is_approved", False)
        loop_count:  int    = final_state.get("loop_count", 0)
        current_drafts      = final_state.get("current_drafts", {})

        # ── 4. Determine pipeline status ─────────────────────────────────
        # WHAT:  Distinguish between a legitimate approval and a circuit-
        #        breaker termination so the frontend can surface the right
        #        UX (e.g. warn the user that content may need manual review).
        #
        # HOW:   `is_approved` is set to True ONLY by the Sentinel node on
        #        a genuine quality pass.  If the graph ended because
        #        `loop_count >= 3`, `is_approved` is still False — we label
        #        that as "partial_success" rather than surfacing a 4xx/5xx
        #        because the content exists and is usable, just not approved.
        if is_approved:
            pipeline_status = "success"
            logger.info(
                "Content generation APPROVED | loops=%d topic=%r",
                loop_count, payload.topic,
            )
        else:
            # Circuit breaker fired — content produced but not approved.
            pipeline_status = "partial_success"
            logger.warning(
                "Content generation hit circuit breaker (loop_count=%d >= 3) "
                "without Sentinel approval | topic=%r — returning last drafts.",
                loop_count,
                payload.topic,
            )

        # ── 5. Return the response DTO ────────────────────────────────────
        # WHAT:  Map the raw graph state into the typed `ContentResponse` DTO.
        # HOW:   FastAPI serialises this via the `response_model` declared
        #        on the route decorator — no manual `.dict()` call needed.
        # WHY ContentResponse not a raw dict?
        #        A typed DTO enforces a stable API contract; breaking changes
        #        to the internal state structure are caught at the Pydantic
        #        layer before malformed JSON reaches the client.
        return ContentResponse(
            status=pipeline_status,
            final_content=current_drafts,
            iteration_count=loop_count,
        )

    except Exception as exc:
        # ── Error boundary ────────────────────────────────────────────────
        # WHAT:  Catch any unhandled exception from the graph (LLM timeout,
        #        Supabase connection error, unexpected JSON parse failure…).
        # HOW:   Log the full traceback server-side; return only a sanitised
        #        message to the client so internal details are never leaked.
        # WHY HTTP 500 (not 422 / 503)?
        #        The request was valid (Pydantic accepted it), but the server
        #        failed to process it — 500 is the correct semantic status.
        logger.error(
            "Unhandled exception in content generation pipeline | topic=%r error=%s",
            payload.topic,
            exc,
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Content generation pipeline encountered an unexpected error. "
                   "Please try again or contact support.",
        )
