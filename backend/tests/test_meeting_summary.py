"""Integration tests for Capstone Module D: Meeting Notes Summarizer."""

from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.services.meeting_service import meeting_service

client = TestClient(app)


def test_meeting_summary_canonical_transcript():
    """
    Test the canonical capstone meeting notes transcript:
    Max: Profits up 50%
    Ruby: New servers are online
    Kyle: Need more time to fix software
    Walker: Happy to help
    Parkman: Beta testing almost done
    """
    raw_transcript = (
        "Max: Profits up 50%\n"
        "Ruby: New servers are online\n"
        "Kyle: Need more time to fix software\n"
        "Walker: Happy to help\n"
        "Parkman: Beta testing almost done"
    )

    mock_summary_output = (
        "## 1. Executive Overview\n"
        "The team reported positive revenue growth and infrastructure delivery, with software bug fixes currently in progress.\n\n"
        "## 2. Key Updates & Progress\n"
        "- **Max**: Profits up 50%\n"
        "- **Ruby**: New servers are online\n"
        "- **Parkman**: Beta testing almost done\n\n"
        "## 3. Blockers, Risks & Dependencies\n"
        "- **Kyle**: Need more time to fix software\n\n"
        "## 4. Support Offered & Cross-Team Assistance\n"
        "- **Walker**: Happy to help with software fixes\n\n"
        "## 5. Decisions Recorded\n"
        "None explicitly recorded.\n\n"
        "## 6. Action Items & Next Steps\n"
        "- [HIGH] [Owner: Kyle & Walker] Pair on software fix to resolve blocking issues."
    )

    with patch.object(meeting_service.llm_service, "generate_text", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = mock_summary_output

        response = client.post(
            "/api/summarize/meeting",
            json={"notes": raw_transcript, "style": "standard"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["feature"] == "meeting"
        assert "Max" in data["result"]
        assert "Ruby" in data["result"]
        assert "Kyle" in data["result"]
        assert "Walker" in data["result"]
        assert "Parkman" in data["result"]
        assert data["usage"] is not None
        assert data["usage"]["character_count"] > 0


def test_meeting_summary_action_focused_style():
    """Verify action-focused meeting summary style is accepted and processed."""
    with patch.object(meeting_service.llm_service, "generate_text", new_callable=AsyncMock) as mock_gen:
        mock_gen.return_value = "## 6. Action Items\n- [HIGH] [Owner: Kyle] Fix software."

        response = client.post(
            "/api/summarize/meeting",
            json={"notes": "Kyle: Need more time to fix software", "style": "action-focused"},
        )
        assert response.status_code == 200
        assert response.json()["success"] is True


def test_meeting_summary_empty_notes_rejected():
    """Verify empty notes payload is rejected with 422 validation error."""
    response = client.post("/api/summarize/meeting", json={"notes": "    "})
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "VALIDATION_ERROR"
