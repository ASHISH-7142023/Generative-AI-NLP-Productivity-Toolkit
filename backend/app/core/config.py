"""Application Configuration settings using pydantic-settings."""

from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration loaded from environment variables or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_ENV: str = Field(default="development", description="Application environment: development or production")
    APP_NAME: str = "Generative AI NLP Productivity Toolkit"
    APP_VERSION: str = "1.0.0"

    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API key")
    OPENAI_MODEL: str = Field(
        default="gpt-4o-mini",
        description="OpenAI model identifier (e.g. gpt-4o-mini, gpt-3.5-turbo, or custom model)",
    )

    FRONTEND_ORIGIN: str = Field(
        default="http://localhost:5173",
        description="Comma-separated or single allowed origin for CORS",
    )

    MAX_INPUT_CHARS: int = Field(
        default=10000,
        description="Maximum characters allowed in a single input field",
    )

    REQUEST_TIMEOUT_SECONDS: float = Field(
        default=30.0,
        description="Timeout in seconds for external OpenAI API calls",
    )

    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-separated origins or return single origin, plus local defaults."""
        origins = [orig.strip() for orig in self.FRONTEND_ORIGIN.split(",") if orig.strip()]
        defaults = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
        for d in defaults:
            if d not in origins:
                origins.append(d)
        return origins


settings = Settings()
