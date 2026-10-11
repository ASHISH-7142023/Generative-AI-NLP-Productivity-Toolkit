"""Test API routes end-to-end with mocked OpenAI responses and exception simulation."""

from unittest.mock import AsyncMock, patch
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.openai_service import MissingAPIKeyError, RateLimitError

client = TestClient(app)


@pytest.mark.asyncio
async def test_eda_generation_route():
    """Verify POST /api/generate/eda returns successful response schema with code."""
    fake_code = "```python\nimport pandas as pd\ndf = pd.read_csv('students.csv')\nprint(df.info())\n```"
    with patch("app.services.data_analysis_service.openai_service.generate_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = fake_code
        response = client.post(
            "/api/generate/eda",
            json={
                "dataset_description": "A student dataset containing marks and attendance",
                "filename": "students.csv",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "eda"
        assert "import pandas as pd" in data["result"]
        mock_llm.assert_awaited_once()


@pytest.mark.asyncio
async def test_visualization_generation_route():
    """Verify POST /api/generate/visualization returns clean matplotlib/seaborn code."""
    fake_code = "import matplotlib.pyplot as plt\nimport seaborn as sns\nplt.figure()\nplt.show()"
    with patch("app.services.data_analysis_service.openai_service.generate_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = fake_code
        response = client.post(
            "/api/generate/visualization",
            json={
                "dataset_description": "A student dataset containing marks and attendance",
                "dataframe_name": "df",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "visualization"
        assert "matplotlib" in data["result"]


@pytest.mark.asyncio
async def test_resume_generation_route():
    """Verify POST /api/generate/resume returns structured resume text."""
    fake_resume = "# Jane Doe\n## Professional Summary\nExperienced Python developer.\n## Technical Skills\nPython, FastAPI"
    with patch("app.services.resume_service.openai_service.generate_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = fake_resume
        response = client.post(
            "/api/generate/resume",
            json={
                "experience": "Jane Doe with 3 years building web apps using Python and FastAPI.",
                "target_role": "Python Backend Engineer",
                "style": "standard",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "resume"
        assert "Jane Doe" in data["result"]


@pytest.mark.asyncio
async def test_interview_questions_route():
    """Verify POST /api/generate/interview-questions returns questions."""
    fake_questions = "1. What is the Java Virtual Machine (JVM)?\n2. Explain polymorphism in Java."
    with patch("app.services.interview_service.openai_service.generate_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = fake_questions
        response = client.post(
            "/api/generate/interview-questions",
            json={
                "language": "Java",
                "difficulty": "Intermediate",
                "count": 5,
                "topic": "Object-oriented programming",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "interview"
        assert "Java Virtual Machine" in data["result"]


@pytest.mark.asyncio
async def test_meeting_summary_route():
    """Verify POST /api/summarize/meeting on capstone example notes."""
    example_notes = (
        "Max: Profits up 50%\n"
        "Ruby: New servers are online\n"
        "Kyle: Need more time to fix software\n"
        "Walker: Happy to help\n"
        "Parkman: Beta testing almost done"
    )
    fake_summary = (
        "## Executive Overview\nMeeting covering Q3 updates and engineering status.\n"
        "## Key Updates\n- Max: Profits up 50%\n- Ruby: New servers are online\n"
        "## Blockers\n- Kyle: Software fix delayed\n"
        "## Support Offered\n- Walker: Willing to help"
    )
    with patch("app.services.meeting_service.openai_service.generate_text", new_callable=AsyncMock) as mock_llm:
        mock_llm.return_value = fake_summary
        response = client.post(
            "/api/summarize/meeting",
            json={"notes": example_notes, "style": "standard"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "meeting"
        assert "Max" in data["result"]


@pytest.mark.asyncio
async def test_missing_api_key_returns_503():
    """Verify that when no API key is set, the endpoint returns HTTP 503 with actionable error message."""
    with patch("app.services.data_analysis_service.openai_service.generate_text", side_effect=MissingAPIKeyError()):
        response = client.post(
            "/api/generate/eda",
            json={"dataset_description": "Sample customer sales records"},
        )
        assert response.status_code == 503
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "MISSING_API_KEY"
        assert "OPENAI_API_KEY" in data["error"]["message"]


@pytest.mark.asyncio
async def test_rate_limit_error_returns_429():
    """Verify that rate limit errors translate to HTTP 429."""
    with patch("app.services.data_analysis_service.openai_service.generate_text", side_effect=RateLimitError()):
        response = client.post(
            "/api/generate/eda",
            json={"dataset_description": "Sample customer sales records"},
        )
        assert response.status_code == 429
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "RATE_LIMIT_EXCEEDED"
