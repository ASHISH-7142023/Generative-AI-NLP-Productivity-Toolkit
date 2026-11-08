"""Unit and validation tests for Capstone Module C: Interview Question Generator."""

from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.services.interview_service import interview_service

client = TestClient(app)


def test_interview_question_count_boundary_valid():
    """Verify minimum (1) and maximum (30) question counts are accepted."""
    with patch.object(interview_service.llm_service, "generate_text", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "### Question 1\nWhat is a GIL in Python?"

        # Test count = 1
        res_min = client.post(
            "/api/generate/interview-questions",
            json={"language": "Python", "difficulty": "Beginner", "count": 1},
        )
        assert res_min.status_code == 200
        assert res_min.json()["success"] is True

        # Test count = 30
        res_max = client.post(
            "/api/generate/interview-questions",
            json={"language": "Python", "difficulty": "Advanced", "count": 30},
        )
        assert res_max.status_code == 200
        assert res_max.json()["success"] is True


def test_interview_question_count_boundary_invalid():
    """Verify out-of-bound question counts (<1 or >30) are rejected."""
    # Count = 0
    res_zero = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "count": 0},
    )
    assert res_zero.status_code == 422

    # Count = 31
    res_overflow = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "count": 31},
    )
    assert res_overflow.status_code == 422


def test_interview_invalid_difficulty_rejected():
    """Verify invalid difficulty string returns 422 validation error."""
    response = client.post(
        "/api/generate/interview-questions",
        json={"language": "Python", "difficulty": "SuperHard", "count": 5},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_interview_empty_language_rejected():
    """Verify blank language name returns 422 validation error."""
    response = client.post(
        "/api/generate/interview-questions",
        json={"language": "   ", "count": 5},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"


def test_interview_multi_language_support():
    """Verify different languages (Go, Rust, SQL, TypeScript) are accepted."""
    languages = ["Go", "Rust", "SQL", "TypeScript"]
    with patch.object(interview_service.llm_service, "generate_text", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "### Question 1\nSample question."
        for lang in languages:
            res = client.post(
                "/api/generate/interview-questions",
                json={"language": lang, "difficulty": "Intermediate", "count": 3},
            )
            assert res.status_code == 200, f"Failed for language: {lang}"
