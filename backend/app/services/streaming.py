"""Streaming utility helpers for Server-Sent Events (SSE) and token streaming."""

import asyncio
import json
from typing import Any, AsyncGenerator, Optional


def format_sse_event(data: Any, event: Optional[str] = None, event_id: Optional[str] = None) -> str:
    """Formats payload into a compliant Server-Sent Events (SSE) chunk.

    Args:
        data: Dict or string to serialize.
        event: Optional event name (e.g. 'token', 'done', 'error').
        event_id: Optional unique event ID.

    Returns:
        Formatted SSE text string ending with double newline.
    """
    lines = []
    if event_id is not None:
        lines.append(f"id: {event_id}")
    if event is not None:
        lines.append(f"event: {event}")

    if isinstance(data, (dict, list)):
        payload_str = json.dumps(data)
    else:
        payload_str = str(data)

    for line in payload_str.split("\n"):
        lines.append(f"data: {line}")

    return "\n".join(lines) + "\n\n"


async def simulate_text_stream(
    text: str,
    chunk_size: int = 20,
    delay_seconds: float = 0.015,
) -> AsyncGenerator[str, None]:
    """Asynchronously yields text in chunks formatted as SSE tokens.

    Useful for streaming mock/cached responses or progressive token delivery.
    """
    length = len(text)
    for i in range(0, length, chunk_size):
        chunk = text[i : i + chunk_size]
        yield format_sse_event({"delta": chunk}, event="token")
        if delay_seconds > 0:
            await asyncio.sleep(delay_seconds)

    # Final completion event
    yield format_sse_event({"done": True, "total_characters": length}, event="done")
