"""Token usage and pricing estimation calculator.

Calculates estimated prompt tokens, completion tokens, and dollar costs
based on standard OpenAI model pricing tiers.
"""

from typing import Dict, NamedTuple


class ModelPricing(NamedTuple):
    input_cost_per_million: float
    output_cost_per_million: float


# Current model rates per 1M tokens (USD)
MODEL_RATES: Dict[str, ModelPricing] = {
    "gpt-4o-mini": ModelPricing(input_cost_per_million=0.15, output_cost_per_million=0.60),
    "gpt-4o": ModelPricing(input_cost_per_million=2.50, output_cost_per_million=10.00),
    "gpt-3.5-turbo": ModelPricing(input_cost_per_million=0.50, output_cost_per_million=1.50),
    "gpt-3.5-turbo-0125": ModelPricing(input_cost_per_million=0.50, output_cost_per_million=1.50),
}

DEFAULT_RATE = ModelPricing(input_cost_per_million=0.50, output_cost_per_million=1.50)


def estimate_token_count(text: str) -> int:
    """Estimates the number of tokens in a text string using character and word heuristics.

    Approximates tokens at ~4 characters per token for English text.
    """
    if not text or not text.strip():
        return 0
    # Blend character-based and whitespace-based approximation
    char_count = len(text)
    word_count = len(text.split())
    # Standard heuristic: 1 token ~= 0.75 words ~= 4 chars
    estimated = max(int(char_count / 4.0), int(word_count * 1.3), 1)
    return estimated


def calculate_cost(
    model: str,
    prompt_tokens: int,
    completion_tokens: int,
) -> float:
    """Calculates estimated cost in USD for a given token usage and model.

    Args:
        model: OpenAI model identifier (e.g. 'gpt-4o-mini').
        prompt_tokens: Number of prompt/input tokens.
        completion_tokens: Number of completion/output tokens.

    Returns:
        Estimated cost in USD rounded to 6 decimal places.
    """
    pricing = MODEL_RATES.get(model.lower(), DEFAULT_RATE)
    input_cost = (prompt_tokens / 1_000_000.0) * pricing.input_cost_per_million
    output_cost = (completion_tokens / 1_000_000.0) * pricing.output_cost_per_million
    return round(input_cost + output_cost, 6)


def get_token_breakdown(
    model: str,
    prompt_text: str,
    completion_text: str,
) -> Dict[str, float]:
    """Generates a complete token and cost breakdown dictionary.

    Args:
        model: Model name.
        prompt_text: Input prompt string.
        completion_text: Generated output string.

    Returns:
        Dictionary with prompt_tokens, completion_tokens, total_tokens, and estimated_cost_usd.
    """
    p_tokens = estimate_token_count(prompt_text)
    c_tokens = estimate_token_count(completion_text)
    total_tokens = p_tokens + c_tokens
    cost = calculate_cost(model, p_tokens, c_tokens)

    return {
        "prompt_tokens": float(p_tokens),
        "completion_tokens": float(c_tokens),
        "total_tokens": float(total_tokens),
        "estimated_cost_usd": cost,
    }
