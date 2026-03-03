"""
Free image generation via the Hugging Face Serverless Inference API.

─────────────────────────────────────────────────────────────────────────────
WHAT
    A single async function `generate_image_hf` that sends a text prompt to
    the FLUX.1-schnell model hosted on HuggingFace's free Serverless
    Inference API and returns the raw image encoded as a base64 string.

HOW
    1. Reads HF_TOKEN from the centralised Settings singleton (SecretStr —
       never logged or serialised).
    2. Makes an async HTTP POST using httpx.AsyncClient (non-blocking,
       compatible with FastAPI's async runtime).
    3. Implements a retry loop (max 3 attempts, 5 s gap) to handle the
       common 503 "model cold-starting" response that HuggingFace returns
       when a model has not been used recently.
    4. On success (HTTP 200), the binary image bytes are base64-encoded and
       returned as a plain Python str — safe to embed in JSON responses.

WHY FLUX.1-schnell?
    • Currently the fastest open-weight diffusion model.
    • Available for free on HF Serverless Inference (no GPU bill).
    • Generates high-quality 1024×1024 images in a single API call.

SECURITY HIGHLIGHTS
    • HF_TOKEN is stored as SecretStr and accessed ONLY via
      .get_secret_value() at the request callsite — never logged.
    • Caller (the FastAPI endpoint) wraps this function in try/except and
      returns HTTP 500 on failure — raw exceptions never reach the client.
─────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import asyncio
import base64
import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────────────────────

_HF_API_URL = (
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
)
_MAX_RETRIES = 3
_RETRY_DELAY_SECONDS = 5


# ── Public interface ─────────────────────────────────────────────────────────

async def generate_image_hf(prompt: str) -> str:
    """Generate an image from *prompt* using FLUX.1-schnell on HuggingFace.

    Parameters
    ----------
    prompt : str
        A descriptive text prompt for the image (e.g. "A cozy Indian café at
        sunset with warm bokeh lights, photorealistic").

    Returns
    -------
    str
        A base64-encoded representation of the generated PNG/JPEG image.
        Suitable for embedding in a JSON response as a data URI:
        ``data:image/png;base64,<returned_str>``.

    Raises
    ------
    Exception
        If the HuggingFace API returns a non-200 / non-503 status after all
        retries are exhausted, or if the network request itself fails.
    """
    settings = get_settings()

    # ── Build request artefacts ───────────────────────────────────────────
    # SECURITY:  .get_secret_value() is the ONE callsite that unwraps the
    # SecretStr.  It is never stored in a local variable that could be
    # accidentally logged.
    headers = {
        "Authorization": f"Bearer {settings.HF_TOKEN.get_secret_value()}",
        "Content-Type": "application/json",
    }
    payload = {"inputs": prompt}

    logger.info("Starting HuggingFace image generation | prompt_length=%d", len(prompt))

    # ── Retry loop ────────────────────────────────────────────────────────
    # WHY retry on 503?
    #   HuggingFace Serverless Inference cold-starts models that haven't
    #   been called recently.  The first request returns 503 with a JSON
    #   body {"error": "Model is currently loading"}.  Waiting 5 s and
    #   retrying is the documented approach.
    async with httpx.AsyncClient(timeout=60.0) as client:
        for attempt in range(1, _MAX_RETRIES + 1):
            logger.debug(
                "HF image generation attempt %d/%d", attempt, _MAX_RETRIES
            )

            response = await client.post(_HF_API_URL, headers=headers, json=payload)

            # ── Happy path ────────────────────────────────────────────────
            if response.status_code == 200:
                image_bytes: bytes = response.content
                encoded: str = base64.b64encode(image_bytes).decode("utf-8")
                logger.info(
                    "HF image generation succeeded | attempt=%d bytes=%d",
                    attempt,
                    len(image_bytes),
                )
                return encoded

            # ── Cold-start handling ───────────────────────────────────────
            if response.status_code == 503:
                if attempt < _MAX_RETRIES:
                    logger.warning(
                        "Model is cold-starting, waiting %ds before retry "
                        "(attempt %d/%d)...",
                        _RETRY_DELAY_SECONDS,
                        attempt,
                        _MAX_RETRIES,
                    )
                    await asyncio.sleep(_RETRY_DELAY_SECONDS)
                    continue
                else:
                    # Final attempt also 503 — give up.
                    logger.error(
                        "HF model still loading after %d attempts — giving up.",
                        _MAX_RETRIES,
                    )
                    raise Exception(
                        f"HuggingFace model did not finish loading after "
                        f"{_MAX_RETRIES} retries ({_RETRY_DELAY_SECONDS}s each). "
                        "Please try again in a minute."
                    )

            # ── Any other non-200 status ──────────────────────────────────
            logger.error(
                "HF image generation failed | status=%d body=%s",
                response.status_code,
                response.text[:300],   # truncate to avoid log bloat
            )
            raise Exception(
                f"HuggingFace Inference API returned unexpected status "
                f"{response.status_code}: {response.text[:200]}"
            )

    # Unreachable — the loop above always returns or raises, but satisfies
    # the type checker.
    raise Exception("Image generation failed: exhausted all retry attempts.")  # pragma: no cover
