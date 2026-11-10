"""FastAPI router defining all endpoints for the productivity toolkit."""

import platform
import sys
import time
from fastapi import APIRouter, status
from app.core.config import settings
from app.api.schemas import (
    HealthResponse,
    SystemMetricsResponse,
    FeatureResponse,
    UsageMetadata,
    EDARequest,
    VisualizationRequest,
    ResumeRequest,
    CoverLetterRequest,
    InterviewQuestionRequest,
    MeetingSummaryRequest,
)
from app.core.cost_calculator import calculate_cost, estimate_token_count

_server_start_time = time.time()


def _make_feature_response(feature: str, result: str, prompt_text: str = "") -> FeatureResponse:
    c_tokens = estimate_token_count(result)
    p_tokens = estimate_token_count(prompt_text) if prompt_text else max(1, c_tokens // 2)
    total_tokens = p_tokens + c_tokens
    cost = calculate_cost(settings.OPENAI_MODEL, p_tokens, c_tokens)
    return FeatureResponse(
        success=True,
        feature=feature,
        result=result,
        usage=UsageMetadata(
            estimated_tokens=total_tokens,
            prompt_tokens=p_tokens,
            completion_tokens=c_tokens,
            estimated_cost_usd=cost,
            character_count=len(result),
            cached=False,
        ),
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
        openai_key_configured=bool(settings.OPENAI_API_KEY),
        environment=settings.APP_ENV,
        cache_status="operational",
    )


@router.get(
    "/system/metrics",
    response_model=SystemMetricsResponse,
    status_code=status.HTTP_200_OK,
    summary="System metrics and runtime diagnostics",
)
async def system_metrics() -> SystemMetricsResponse:
    """Returns application uptime, Python version, and active route count."""
    uptime = time.time() - _server_start_time
    return SystemMetricsResponse(
        status="ok",
        service="nlp-productivity-toolkit",
        version=settings.APP_VERSION,
        uptime_seconds=round(uptime, 2),
        python_version=platform.python_version(),
        configured_model=settings.OPENAI_MODEL,
        active_endpoints=len(router.routes),
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
    return _make_feature_response("eda", result)


@router.post(
    "/generate/visualization",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Matplotlib & Seaborn Data Visualization Python Code",
)
async def generate_visualization(request: VisualizationRequest) -> FeatureResponse:
    """Generate commented Python code for plotting with Matplotlib and Seaborn."""
    result = await data_analysis_service.generate_visualization_code(request)
    return _make_feature_response("visualization", result)


@router.post(
    "/generate/resume",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured resume from experience paragraph",
)
async def generate_resume(request: ResumeRequest) -> FeatureResponse:
    """Transform experience paragraph into a professional structured resume."""
    result = await resume_service.generate_resume(request)
    return _make_feature_response("resume", result, prompt_text=request.experience)


@router.post(
    "/generate/cover-letter",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate tailored cover letter aligned with job requirements",
)
async def generate_cover_letter(request: CoverLetterRequest) -> FeatureResponse:
    """Generate job-tailored cover letter based strictly on candidate's real experience."""
    result = await resume_service.generate_cover_letter(request)
    combined_prompt = f"{request.experience_text}\n{request.job_description}"
    return _make_feature_response("cover_letter", result, prompt_text=combined_prompt)


@router.post(
    "/generate/interview-questions",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate technical interview questions",
)
async def generate_interview_questions(request: InterviewQuestionRequest) -> FeatureResponse:
    """Generate programming interview questions for specified language and difficulty."""
    result = await interview_service.generate_interview_questions(request)
    return _make_feature_response("interview", result)


@router.post(
    "/summarize/meeting",
    response_model=FeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Summarize raw meeting notes into structured actions and updates",
)
async def summarize_meeting(request: MeetingSummaryRequest) -> FeatureResponse:
    """Summarize meeting notes into overview, speaker updates, blockers, and action items."""
    result = await meeting_service.summarize_meeting(request)
    return _make_feature_response("meeting", result)
