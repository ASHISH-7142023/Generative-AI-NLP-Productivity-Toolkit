"""OpenAI Service isolating all external LLM SDK calls, error handling, and timeout enforcement."""

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
    """Manages OpenAI client and completions."""

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
        )
        return self._client

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = "You are a helpful and accurate AI assistant.",
        temperature: float = 0.2,
        max_tokens: int = 3000,
    ) -> str:
        """Call the configured OpenAI model and return the generated text response."""
        client = self.get_client()
        model_name = settings.OPENAI_MODEL

        try:
            logger.info("Dispatching completion request to OpenAI model '%s'", model_name)
            response = await client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )

            if not response.choices or not response.choices[0].message.content:
                raise OpenAIServiceException("Received an empty response from OpenAI.", code="EMPTY_RESPONSE", status_code=502)

            content = response.choices[0].message.content.strip()
            return content

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
        except openai.APIConnectionError as e:
            logger.error("OpenAI connection failed: %s", str(e))
            raise OpenAIServiceException("Could not connect to the OpenAI API.", code="CONNECTION_ERROR", status_code=503) from e
        except openai.APIError as e:
            logger.error("OpenAI API error: %s", str(e))
            raise OpenAIServiceException(f"OpenAI service error: {e.message or str(e)}", code="OPENAI_API_ERROR", status_code=502) from e
        except Exception as e:
            logger.error("Unexpected error during OpenAI generation: %s", str(e))
            raise OpenAIServiceException(f"Unexpected generation error: {str(e)}", code="INTERNAL_GENERATION_ERROR", status_code=500) from e


# Global service instance
openai_service = OpenAIService()
