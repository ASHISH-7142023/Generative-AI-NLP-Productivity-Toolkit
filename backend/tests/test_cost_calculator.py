"""Unit tests for token cost and latency estimation calculator."""

import pytest
from app.core.cost_calculator import (
    estimate_token_count,
    calculate_cost,
    get_token_breakdown,
    MODEL_RATES,
)


def test_estimate_token_count_empty_and_whitespace():
    assert estimate_token_count("") == 0
    assert estimate_token_count("   ") == 0


def test_estimate_token_count_short_text():
    sample = "Hello world! This is a test sentence."
    tokens = estimate_token_count(sample)
    assert 5 <= tokens <= 20


def test_estimate_token_count_scaling():
    short_text = "Analysis of quarterly results."
    long_text = short_text * 10
    short_tokens = estimate_token_count(short_text)
    long_tokens = estimate_token_count(long_text)
    assert long_tokens > short_tokens


def test_calculate_cost_gpt_4o_mini():
    # 1,000,000 prompt tokens = $0.15, 1,000,000 completion tokens = $0.60
    cost = calculate_cost("gpt-4o-mini", 1_000_000, 1_000_000)
    assert round(cost, 2) == 0.75


def test_calculate_cost_gpt_4o():
    # 1,000 prompt tokens at $2.50/M + 1,000 completion tokens at $10.00/M
    cost = calculate_cost("gpt-4o", 1000, 1000)
    assert cost > 0.01


def test_calculate_cost_fallback_model():
    cost = calculate_cost("unknown-experimental-model", 1000, 1000)
    assert cost > 0.0


def test_get_token_breakdown_structure():
    prompt = "Create a pandas script to load sales.csv and inspect null values."
    completion = "import pandas as pd\ndf = pd.read_csv('sales.csv')\nprint(df.isna().sum())"

    breakdown = get_token_breakdown("gpt-4o-mini", prompt, completion)
    assert "prompt_tokens" in breakdown
    assert "completion_tokens" in breakdown
    assert "total_tokens" in breakdown
    assert "estimated_cost_usd" in breakdown
    assert breakdown["total_tokens"] == breakdown["prompt_tokens"] + breakdown["completion_tokens"]
    assert breakdown["estimated_cost_usd"] > 0
