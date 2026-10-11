"""Main FastAPI Application Entrypoint."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import router
from app.api.schemas import ErrorDetail, ErrorResponse
from app.core.config import settings
from app.core.logging_config import logger, setup_logging
from app.services.openai_service import OpenAIServiceException


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown diagnostics."""
    setup_logging()
    logger.info("Starting %s v%s in %s mode", settings.APP_NAME, settings.APP_VERSION, settings.APP_ENV)
    logger.info("Configured OpenAI model: %s", settings.OPENAI_MODEL)
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY is not set. Real generation requests will return a 503 setup error until configured.")
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for Generative AI NLP Productivity Toolkit (EDA, Visualizations, Resumes, Interviews, Meeting Summaries).",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV == "development" else None,
    redoc_url="/redoc" if settings.APP_ENV == "development" else None,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


# Global Exception Handlers ensuring unified response contract
@app.exception_handler(OpenAIServiceException)
async def openai_service_exception_handler(request: Request, exc: OpenAIServiceException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            success=False,
            error=ErrorDetail(code=exc.code, message=exc.message),
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg", "Validation error occurred.") if errors else "Validation failed."
    # Clean up error message prefix if pydantic gives 'Value error, ...'
    if first_msg.startswith("Value error, "):
        first_msg = first_msg[len("Value error, "):]

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content=ErrorResponse(
            success=False,
            error=ErrorDetail(code="VALIDATION_ERROR", message=first_msg),
        ).model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            success=False,
            error=ErrorDetail(code="HTTP_ERROR", message=str(exc.detail)),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server exception: %s", str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            success=False,
            error=ErrorDetail(code="INTERNAL_SERVER_ERROR", message="An unexpected server error occurred."),
        ).model_dump(),
    )


@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "Generative AI NLP Productivity Toolkit API is online.",
        "docs": "/docs",
        "health": "/api/health",
    }
