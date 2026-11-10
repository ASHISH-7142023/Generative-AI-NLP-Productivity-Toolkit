"""Integration and unit tests for the cover letter generation endpoint."""

from unittest.mock import AsyncMock, patch
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_cover_letter_validation_rejects_blank_inputs():
    response = client.post(
        "/api/generate/cover-letter",
        json={
            "experience_text": "   ",
            "job_description": "Valid job description requiring Python and AWS.",
        },
    )
    assert response.status_code == 422


def test_cover_letter_validation_rejects_too_short_inputs():
    response = client.post(
        "/api/generate/cover-letter",
        json={
            "experience_text": "Too short",
            "job_description": "Short",
        },
    )
    assert response.status_code == 422


@patch("app.services.openai_service.OpenAIService.generate_text", new_callable=AsyncMock)
def test_cover_letter_generation_success(mock_generate):
    mock_letter = (
        "# Cover Letter\n\n"
        "Dear Hiring Team at TechCorp,\n\n"
        "I am writing to express my enthusiastic interest in the Senior Full-Stack Engineer role...\n"
    )
    mock_generate.return_value = mock_letter

    response = client.post(
        "/api/generate/cover-letter",
        json={
            "experience_text": "Over 5 years building distributed web applications with FastAPI, React, and PostgreSQL.",
            "job_description": "Seeking Senior Engineer experienced with Python backends and modern React frontends.",
            "company_name": "TechCorp",
            "tone": "enthusiastic",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["feature"] == "cover_letter"
    assert "TechCorp" in data["result"]
    assert "usage" in data
    assert data["usage"]["estimated_tokens"] > 0
    assert "estimated_cost_usd" in data["usage"]
