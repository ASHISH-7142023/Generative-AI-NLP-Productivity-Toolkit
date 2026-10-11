"""FastAPI router defining all endpoints for the productivity toolkit."""

from fastapi import APIRouter, status
from app.core.config import settings
from app.api.schemas import (
    HealthResponse,
    FeatureResponse,
    EDARequest,
    VisualizationRequest,
    ResumeRequest,
    InterviewQuestionRequest,
    MeetingSummaryRequest,
)
from app.services.data_analysis_service import data_analysis_service
from app.services.resume_service import resume_service
from app.services.interview_service import interview_service
from app.services.meeting_service import meeting_service

router = APIRouter(prefix="/api", tags=["Productivity Toolkit"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check endpoint",
)
async def health_check() -> HealthResponse:
    """Returns application status and configured model without exposing secrets."""
    return HealthResponse(
        status="ok",
        service="nlp-productivity-toolkit",
        version=settings.APP_VERSION,
        model_configured=settings.OPENAI_MODEL,
    )


@router.post(
    "/generate/eda",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Pandas Exploratory Data Analysis Python Code",
)
async def generate_eda(request: EDARequest) -> FeatureResponse:
    """Generate commented Python code for exploratory data analysis using Pandas."""
    result = await data_analysis_service.generate_eda_code(request)
    return FeatureResponse(
        success=True,
        feature="eda",
        result=result,
    )


@router.post(
    "/generate/visualization",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Matplotlib & Seaborn Data Visualization Python Code",
)
async def generate_visualization(request: VisualizationRequest) -> FeatureResponse:
    """Generate commented Python code for plotting with Matplotlib and Seaborn."""
    result = await data_analysis_service.generate_visualization_code(request)
    return FeatureResponse(
        success=True,
        feature="visualization",
        result=result,
    )


@router.post(
    "/generate/resume",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured resume from experience paragraph",
)
async def generate_resume(request: ResumeRequest) -> FeatureResponse:
    """Transform experience paragraph into a professional structured resume."""
    result = await resume_service.generate_resume(request)
    return FeatureResponse(
        success=True,
        feature="resume",
        result=result,
    )


@router.post(
    "/generate/interview-questions",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate technical interview questions",
)
async def generate_interview_questions(request: InterviewQuestionRequest) -> FeatureResponse:
    """Generate programming interview questions for specified language and difficulty."""
    result = await interview_service.generate_interview_questions(request)
    return FeatureResponse(
        success=True,
        feature="interview",
        result=result,
    )


@router.post(
    "/summarize/meeting",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarize raw meeting notes into structured actions and updates",
)
async def summarize_meeting(request: MeetingSummaryRequest) -> FeatureResponse:
    """Summarize meeting notes into overview, speaker updates, blockers, and action items."""
    result = await meeting_service.summarize_meeting(request)
    return FeatureResponse(
        success=True,
        feature="meeting",
        result=result,
    )
