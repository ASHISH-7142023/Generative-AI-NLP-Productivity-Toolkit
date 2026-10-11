"""Interview question generation service."""

from app.api.schemas import InterviewQuestionRequest
from app.prompts.interview import build_interview_prompt
from app.services.openai_service import OpenAIService, openai_service


class InterviewService:
    """Coordinates prompt construction and generation for technical interview questions."""

    def __init__(self, llm_service: OpenAIService = openai_service):
        self.llm_service = llm_service

    async def generate_interview_questions(self, request: InterviewQuestionRequest) -> str:
        """Generate targeted programming interview questions."""
        prompt = build_interview_prompt(
            language=request.language,
            difficulty=request.difficulty.value,
            count=request.count,
            topic=request.topic,
            include_answers=request.include_answers,
        )
        system_msg = (
            f"You are a principal software engineer conducting technical interviews for {request.language}. "
            "Write distinct, high-quality, relevant interview questions."
        )
        return await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=0.4,
        )


interview_service = InterviewService()
