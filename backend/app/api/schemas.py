"""Pydantic request and response schemas for all API endpoints."""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ResumeStyle(str, Enum):
    CONCISE = "concise"
    STANDARD = "standard"
    DETAILED = "detailed"


class InterviewDifficulty(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class MeetingSummaryStyle(str, Enum):
    CONCISE = "concise"
    STANDARD = "standard"
    ACTION_FOCUSED = "action-focused"


# ----------------- Requests -----------------

class EDARequest(BaseModel):
    dataset_description: str = Field(
        ...,
        min_length=3,
        max_length=10000,
        description="Description of dataset and its columns/structure",
    )
    filename: Optional[str] = Field(
        default="dataset.csv",
        max_length=255,
        description="Optional CSV filename or path to load",
    )
    analysis_goals: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Optional specific goals such as missing value checks, distributions, or outliers",
    )

    @field_validator("dataset_description")
    @classmethod
    def validate_non_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Dataset description cannot be empty or whitespace only.")
        return v.strip()


class VisualizationRequest(BaseModel):
    dataset_description: str = Field(
        ...,
        min_length=3,
        max_length=10000,
        description="Description of the dataset columns and values to plot",
    )
    dataframe_name: Optional[str] = Field(
        default="df",
        max_length=64,
        description="DataFrame variable name (e.g. df)",
    )
    visualization_goal: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Specific chart types or relationships to visualize",
    )
    columns: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional comma-separated list of column names",
    )

    @field_validator("dataset_description")
    @classmethod
    def validate_non_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Dataset description cannot be empty or whitespace only.")
        return v.strip()


class ResumeRequest(BaseModel):
    experience: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Paragraph describing experience, skills, projects, and education",
    )
    target_role: Optional[str] = Field(
        default=None,
        max_length=128,
        description="Target job title or role",
    )
    style: Optional[ResumeStyle] = Field(
        default=ResumeStyle.STANDARD,
        description="Resume formatting style: concise, standard, or detailed",
    )

    @field_validator("experience")
    @classmethod
    def validate_non_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Experience paragraph cannot be empty or whitespace only.")
        return v.strip()


class InterviewQuestionRequest(BaseModel):
    language: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Target programming language (e.g., Python, Java, C++, Go, SQL)",
    )
    difficulty: InterviewDifficulty = Field(
        default=InterviewDifficulty.INTERMEDIATE,
        description="Difficulty level: Beginner, Intermediate, or Advanced",
    )
    count: int = Field(
        default=5,
        ge=1,
        le=30,
        description="Number of questions to generate (1 to 30)",
    )
    topic: Optional[str] = Field(
        default=None,
        max_length=256,
        description="Optional technical topic (e.g. OOP, Concurrency, Algorithms)",
    )
    include_answers: Optional[bool] = Field(
        default=True,
        description="Whether to include suggested answers, hints, or solution outlines",
    )

    @field_validator("language")
    @classmethod
    def validate_non_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Programming language cannot be empty or whitespace only.")
        return v.strip()


class MeetingSummaryRequest(BaseModel):
    notes: str = Field(
        ...,
        min_length=5,
        max_length=10000,
        description="Raw meeting notes transcript or bullet points",
    )
    style: Optional[MeetingSummaryStyle] = Field(
        default=MeetingSummaryStyle.STANDARD,
        description="Summary depth: concise, standard, or action-focused",
    )

    @field_validator("notes")
    @classmethod
    def validate_non_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Meeting notes cannot be empty or whitespace only.")
        return v.strip()


# ----------------- Responses -----------------

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "nlp-productivity-toolkit"
    version: str = "1.0.0"
    model_configured: str


class FeatureResponse(BaseModel):
    success: bool = True
    feature: str
    result: str


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
