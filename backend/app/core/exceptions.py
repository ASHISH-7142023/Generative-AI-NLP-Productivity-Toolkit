"""Structured domain exceptions and unified error envelope handlers.

Provides consistent, human-readable JSON error structures across all API boundaries.
"""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base domain exception with HTTP status code and error code."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "error": {
                "code": self.error_code,
                "message": self.message,
                "status_code": self.status_code,
            }
        }
        if self.details:
            payload["error"]["details"] = self.details
        return payload


class AuthenticationError(AppException):
    def __init__(self, message: str = "OpenAI API key is missing or invalid.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=503,
            error_code="AUTHENTICATION_REQUIRED",
            details=details,
        )


class RateLimitExceededError(AppException):
    def __init__(self, message: str = "Rate limit exceeded. Please retry after some time.", retry_after: int = 60):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
            details={"retry_after_seconds": retry_after},
        )


class PromptInjectionError(AppException):
    def __init__(self, message: str = "Input contains disallowed prompt manipulation phrases.", patterns: Optional[list] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="PROMPT_INJECTION_DETECTED",
            details={"detected_patterns": patterns or []},
        )


class PayloadTooLargeError(AppException):
    def __init__(self, message: str = "Input text exceeds maximum allowed character length.", max_allowed: int = 10000):
        super().__init__(
            message=message,
            status_code=413,
            error_code="PAYLOAD_TOO_LARGE",
            details={"max_allowed_characters": max_allowed},
        )


class UpstreamProviderError(AppException):
    def __init__(self, message: str = "Upstream AI provider error occurred.", provider: str = "OpenAI"):
        super().__init__(
            message=message,
            status_code=502,
            error_code="UPSTREAM_PROVIDER_ERROR",
            details={"provider": provider},
        )
