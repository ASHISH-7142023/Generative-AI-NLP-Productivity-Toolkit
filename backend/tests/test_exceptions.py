"""Unit tests for domain exception classes and error dictionary serialization."""

import pytest
from app.core.exceptions import (
    AppException,
    AuthenticationError,
    RateLimitExceededError,
    PromptInjectionError,
    PayloadTooLargeError,
    UpstreamProviderError,
)


def test_base_app_exception_defaults():
    exc = AppException("Custom internal error", status_code=500, error_code="CUSTOM_CODE")
    payload = exc.to_dict()

    assert payload["error"]["code"] == "CUSTOM_CODE"
    assert payload["error"]["message"] == "Custom internal error"
    assert payload["error"]["status_code"] == 500


def test_authentication_error():
    exc = AuthenticationError()
    assert exc.status_code == 503
    assert exc.error_code == "AUTHENTICATION_REQUIRED"
    assert "missing or invalid" in exc.message


def test_rate_limit_exceeded_error():
    exc = RateLimitExceededError(retry_after=45)
    assert exc.status_code == 429
    assert exc.error_code == "RATE_LIMIT_EXCEEDED"
    payload = exc.to_dict()
    assert payload["error"]["details"]["retry_after_seconds"] == 45


def test_prompt_injection_error():
    exc = PromptInjectionError(patterns=["[BLOCKED: INSTRUCTION_OVERRIDE]"])
    assert exc.status_code == 400
    assert exc.error_code == "PROMPT_INJECTION_DETECTED"
    payload = exc.to_dict()
    assert "[BLOCKED: INSTRUCTION_OVERRIDE]" in payload["error"]["details"]["detected_patterns"]


def test_payload_too_large_error():
    exc = PayloadTooLargeError(max_allowed=5000)
    assert exc.status_code == 413
    assert exc.error_code == "PAYLOAD_TOO_LARGE"
    payload = exc.to_dict()
    assert payload["error"]["details"]["max_allowed_characters"] == 5000


def test_upstream_provider_error():
    exc = UpstreamProviderError(provider="OpenAI")
    assert exc.status_code == 502
    assert exc.error_code == "UPSTREAM_PROVIDER_ERROR"
    assert exc.details["provider"] == "OpenAI"
