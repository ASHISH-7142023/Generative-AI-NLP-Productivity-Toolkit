"""OpenAI Service isolating all external LLM SDK calls, error handling, retries, and timeout enforcement."""

import asyncio
from typing import Optional
import openai
from openai import AsyncOpenAI

from app.core.config import settings
from app.core.logging_config import logger


class OpenAIServiceException(Exception):
    """Base exception for OpenAI service errors."""
    def __init__(self, message: str, code: str = "OPENAI_ERROR", status_code: int = 502):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class MissingAPIKeyError(OpenAIServiceException):
    def __init__(self, message: str = "OpenAI API key is not configured. Please set OPENAI_API_KEY in your backend .env file."):
        super().__init__(message, code="MISSING_API_KEY", status_code=503)


class AuthenticationError(OpenAIServiceException):
    def __init__(self, message: str = "Invalid OpenAI API key or authentication failed."):
        super().__init__(message, code="AUTHENTICATION_FAILED", status_code=401)


class RateLimitError(OpenAIServiceException):
    def __init__(self, message: str = "OpenAI rate limit or quota exceeded. Please check your account billing or limits."):
        super().__init__(message, code="RATE_LIMIT_EXCEEDED", status_code=429)


class TimeoutError(OpenAIServiceException):
    def __init__(self, message: str = "Request to OpenAI API timed out."):
        super().__init__(message, code="API_TIMEOUT", status_code=504)


class OpenAIService:
    """Manages OpenAI client, exponential retries, and completions."""

    def __init__(self, client: Optional[AsyncOpenAI] = None):
        self._client = client

    def get_client(self) -> AsyncOpenAI:
        """Initialize or retrieve the AsyncOpenAI client."""
        if self._client is not None:
            return self._client

        api_key = settings.OPENAI_API_KEY
        if not api_key or not api_key.strip():
            raise MissingAPIKeyError()

        self._client = AsyncOpenAI(
            api_key=api_key.strip(),
            timeout=settings.REQUEST_TIMEOUT_SECONDS,
            max_retries=settings.OPENAI_MAX_RETRIES,
        )
        return self._client

    async def _execute_completion(
        self,
        client: AsyncOpenAI,
        model_name: str,
        messages: list,
        temperature: float,
        max_tokens: int,
    ) -> str:
        """Internal helper to request completion with backoff retry."""
        attempts = 0
        max_attempts = max(1, settings.OPENAI_MAX_RETRIES + 1)

        while attempts < max_attempts:
            attempts += 1
            try:
                response = await client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
                if not response.choices or not response.choices[0].message.content:
                    raise OpenAIServiceException("Received an empty response from OpenAI.", code="EMPTY_RESPONSE", status_code=502)
                return response.choices[0].message.content.strip()
            except (openai.RateLimitError, openai.APITimeoutError) as transient_err:
                if attempts >= max_attempts:
                    raise
                backoff_delay = 1.5 ** attempts
                logger.warning(
                    "Transient OpenAI error on attempt %d/%d (%s). Retrying in %.2fs...",
                    attempts, max_attempts, type(transient_err).__name__, backoff_delay
                )
                await asyncio.sleep(backoff_delay)

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = "You are a helpful and accurate AI assistant.",
        temperature: float = 0.2,
        max_tokens: int = 3000,
    ) -> str:
        """Call the configured OpenAI model with fallback and return the generated text response."""
        client = self.get_client()
        primary_model = settings.OPENAI_MODEL
        fallback_model = settings.OPENAI_FALLBACK_MODEL

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]

        try:
            logger.info("Dispatching completion request to OpenAI model '%s'", primary_model)
            return await self._execute_completion(client, primary_model, messages, temperature, max_tokens)

        except MissingAPIKeyError:
            raise
        except openai.AuthenticationError as e:
            logger.error("OpenAI authentication error: %s", str(e))
            raise AuthenticationError() from e
        except openai.RateLimitError as e:
            logger.warning("OpenAI rate limit error: %s", str(e))
            raise RateLimitError() from e
        except openai.APITimeoutError as e:
            logger.error("OpenAI timeout: %s", str(e))
            raise TimeoutError() from e
        except openai.APIError as e:
            # If primary model fails and fallback model is configured, try fallback model
            if fallback_model and fallback_model != primary_model and hasattr(e, "status_code") and e.status_code in (404, 500, 502, 503):
                logger.warning("Primary model '%s' failed (%s). Attempting fallback model '%s'", primary_model, str(e), fallback_model)
                try:
                    return await self._execute_completion(client, fallback_model, messages, temperature, max_tokens)
                except Exception as fallback_err:
                    logger.error("Fallback model also failed: %s", str(fallback_err))
            logger.error("OpenAI API error: %s", str(e))
            raise OpenAIServiceException(
                f"OpenAI service reported an error: {str(e)}",
                code="OPENAI_API_ERROR",
                status_code=502,
            ) from e
        except Exception as e:
            if isinstance(e, OpenAIServiceException):
                raise
            logger.exception("Unexpected error calling OpenAI service: %s", str(e))
            raise OpenAIServiceException(
                "An unexpected error occurred while communicating with the AI service.",
                code="SERVICE_UNAVAILABLE",
                status_code=503,
            ) from e


openai_service = OpenAIService()
