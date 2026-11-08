"""Custom ASGI Middlewares for Request Correlation and Performance Timing."""

import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging_config import logger


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware that ensures every incoming request has an X-Request-ID correlation header,
    measures execution duration, and attaches an X-Process-Time response header.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        # Extract existing or generate a new UUID for correlation
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.perf_counter()
        
        logger.info(
            "Incoming request: method=%s path=%s request_id=%s client=%s",
            request.method,
            request.url.path,
            request_id,
            request.client.host if request.client else "unknown",
        )

        try:
            response = await call_next(request)
        except Exception:
            process_time = (time.perf_counter() - start_time) * 1000.0
            logger.exception(
                "Request failed: method=%s path=%s request_id=%s duration=%.2fms",
                request.method,
                request.url.path,
                request_id,
                process_time,
            )
            raise

        process_time = (time.perf_counter() - start_time) * 1000.0
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"

        logger.info(
            "Completed request: method=%s path=%s status=%s request_id=%s duration=%.2fms",
            request.method,
            request.url.path,
            response.status_code,
            request_id,
            process_time,
        )

        return response
