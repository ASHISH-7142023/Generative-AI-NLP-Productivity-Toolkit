"""Unit tests for ASGI custom middleware and security headers."""

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import InMemoryRateLimiter

client = TestClient(app)


def test_request_id_generated_when_missing():
    """Verify that every response receives an X-Request-ID header when none is provided."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert "x-request-id" in response.headers
    assert len(response.headers["x-request-id"]) > 0


def test_request_id_preserved_when_provided():
    """Verify that a provided X-Request-ID is preserved and returned."""
    custom_id = "test-correlation-id-12345"
    response = client.get("/api/health", headers={"X-Request-ID": custom_id})
    assert response.status_code == 200
    assert response.headers.get("x-request-id") == custom_id


def test_process_time_header_present():
    """Verify that X-Process-Time header indicates execution duration in ms."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert "x-process-time" in response.headers
    assert response.headers["x-process-time"].endswith("ms")


def test_security_headers_present():
    """Verify presence of security hardening headers."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert response.headers.get("x-xss-protection") == "1; mode=block"
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"


def test_in_memory_rate_limiter():
    """Verify rate limiter allows within limits and blocks when threshold is exceeded."""
    limiter = InMemoryRateLimiter(requests_per_minute=3)
    client_ip = "192.168.1.100"

    assert limiter.is_allowed(client_ip) is True
    assert limiter.is_allowed(client_ip) is True
    assert limiter.is_allowed(client_ip) is True
    assert limiter.is_allowed(client_ip) is False  # 4th request exceeds limit
