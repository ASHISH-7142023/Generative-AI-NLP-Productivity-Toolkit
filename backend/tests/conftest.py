"""Shared pytest fixtures, mock clients, and payload factories."""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from app.main import app
from app.services.openai_service import openai_service


@pytest.fixture
def client() -> TestClient:
    """Standard FastAPI TestClient fixture."""
    return TestClient(app)


@pytest.fixture
def mock_eda_payload() -> dict:
    return {
        "dataset_description": "Columns: passenger_id, survived, pclass, age, fare",
        "filename": "titanic.csv",
        "analysis_goals": "Explore survival rates across ticket classes",
        "eda_mode": "comprehensive",
    }


@pytest.fixture
def mock_viz_payload() -> dict:
    return {
        "dataset_description": "Columns: date, region, monthly_sales",
        "dataframe_name": "df_sales",
        "visualization_goal": "Bar chart of total sales by region",
        "columns": "region, monthly_sales",
    }


@pytest.fixture
def mock_resume_payload() -> dict:
    return {
        "experience": (
            "Senior Python developer at TechCorp from 2020-2024. Designed and implemented "
            "microservices using FastAPI and PostgreSQL, reducing latency by 35%. "
            "Mentored 4 junior engineers and deployed containers with Docker and Kubernetes."
        ),
        "target_role": "Lead Backend Engineer",
        "style": "standard",
    }


@pytest.fixture
def mock_interview_payload() -> dict:
    return {
        "language": "Python",
        "difficulty": "Intermediate",
        "count": 3,
        "topic": "Generators and Decorators",
        "include_answers": True,
    }


@pytest.fixture
def mock_meeting_payload() -> dict:
    return {
        "notes": (
            "Max: Profits up 50%\n"
            "Ruby: New servers are online\n"
            "Kyle: Need more time to fix software\n"
            "Walker: Happy to help\n"
            "Parkman: Beta testing almost done"
        ),
        "style": "standard",
    }


@pytest.fixture
def mock_openai_response():
    """Mock OpenAI service helper to isolate route tests from live network/API calls."""
    with patch.object(openai_service, "generate_text", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "Mocked AI Response Content"
        yield mock_gen
