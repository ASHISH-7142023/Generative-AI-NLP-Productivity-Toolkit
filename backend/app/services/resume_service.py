"""Resume generation service transforming experience paragraphs into professional resumes."""

from app.api.schemas import ResumeRequest, CoverLetterRequest
from app.prompts.resume import build_resume_prompt, build_cover_letter_prompt
from app.services.openai_service import OpenAIService, openai_service


class ResumeService:
    """Coordinates prompt construction and generation for resume building."""

    def __init__(self, llm_service: OpenAIService = openai_service):
        self.llm_service = llm_service

    async def generate_resume(self, request: ResumeRequest) -> str:
        """Generate a structured, professional resume strictly based on user-supplied details."""
        prompt = build_resume_prompt(
            experience=request.experience,
            target_role=request.target_role,
            style=request.style.value if request.style else "standard",
        )
        system_msg = (
            "You are a professional executive resume writer. Adhere strictly to the facts provided. "
            "Never fabricate companies, credentials, awards, dates, or certifications."
        )
        return await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=0.3,
        )

    async def generate_cover_letter(self, request: CoverLetterRequest) -> str:
        """Generate a tailored, ATS-aligned cover letter strictly matching candidate facts to job needs."""
        prompt = build_cover_letter_prompt(
            experience=request.experience_text,
            job_description=request.job_description,
            company_name=request.company_name,
            tone=request.tone,
        )
        system_msg = (
            "You are an executive talent acquisition strategist. Tailor the candidate's actual accomplishments "
            "to the job requirements using professional, persuasive language. Never fabricate achievements or skills."
        )
        temp = request.temperature if request.temperature is not None else 0.4
        return await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=temp,
        )


resume_service = ResumeService()
