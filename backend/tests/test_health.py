"""Test health check and application metadata endpoint."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify GET /api/health returns 200 with expected structure and no secrets."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "nlp-productivity-toolkit"
    assert "version" in data
    assert "model_configured" in data
    # Ensure no API key or environment secrets are exposed
    assert "OPENAI_API_KEY" not in str(data)
    assert "api_key" not in data
