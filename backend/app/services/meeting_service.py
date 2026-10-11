"""Meeting notes summarizer service."""

from app.api.schemas import MeetingSummaryRequest
from app.prompts.meeting import build_meeting_summary_prompt
from app.services.openai_service import OpenAIService, openai_service


class MeetingService:
    """Coordinates prompt construction and generation for meeting summarization."""

    def __init__(self, llm_service: OpenAIService = openai_service):
        self.llm_service = llm_service

    async def summarize_meeting(self, request: MeetingSummaryRequest) -> str:
        """Generate structured executive meeting summary preserving speaker updates, blockers, and actions."""
        prompt = build_meeting_summary_prompt(
            notes=request.notes,
            style=request.style.value if request.style else "standard",
        )
        system_msg = (
            "You are an executive project assistant. Synthesize the meeting notes faithfully. "
            "Attribute updates to participants and never fabricate decisions or commitments."
        )
        return await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=0.2,
        )


meeting_service = MeetingService()
