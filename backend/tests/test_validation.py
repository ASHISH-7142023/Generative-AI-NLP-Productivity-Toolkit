"""Test input validation, edge cases, and boundary constraints across all endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_eda_blank_dataset_description():
    """Verify that blank or whitespace-only dataset descriptions are rejected."""
    response = client.post("/api/generate/eda", json={"dataset_description": "   "})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "empty or whitespace" in data["error"]["message"].lower()


def test_visualization_blank_dataset():
    """Verify that empty visualization input is rejected."""
    response = client.post("/api/generate/visualization", json={"dataset_description": ""})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_resume_blank_experience():
    """Verify that empty resume experience paragraph is rejected."""
    response = client.post("/api/generate/resume", json={"experience": "   "})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_interview_count_boundaries():
    """Verify interview count boundary validation: count must be between 1 and 30."""
    # Count < 1
    resp_zero = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "difficulty": "Beginner", "count": 0},
    )
    assert resp_zero.status_code == 422
    assert resp_zero.json()["success"] is False

    # Count > 30
    resp_large = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "difficulty": "Beginner", "count": 31},
    )
    assert resp_large.status_code == 422
    assert resp_large.json()["success"] is False


def test_interview_invalid_difficulty():
    """Verify invalid difficulty level is rejected."""
    response = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "difficulty": "SuperHard", "count": 5},
    )
    assert response.status_code == 422
    assert response.json()["success"] is False


def test_meeting_notes_blank():
    """Verify empty meeting notes are rejected."""
    response = client.post("/api/summarize/meeting", json={"notes": "  "})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
