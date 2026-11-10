"""Unit tests for thread-safe in-memory LRU response cache."""

import time
import pytest
from app.core.cache import ResponseCache


def test_cache_generate_key_deterministic():
    payload1 = {"prompt": "EDA for churn", "temperature": 0.2}
    payload2 = {"temperature": 0.2, "prompt": "EDA for churn"}

    key1 = ResponseCache.generate_key("eda", payload1)
    key2 = ResponseCache.generate_key("eda", payload2)
    assert key1 == key2
    assert key1.startswith("eda:")


def test_cache_set_and_get():
    cache = ResponseCache(max_size=10, default_ttl=60.0)
    cache.set("key1", "sample_result")

    assert cache.get("key1") == "sample_result"
    assert cache.hits == 1
    assert cache.misses == 0


def test_cache_miss():
    cache = ResponseCache(max_size=10, default_ttl=60.0)
    assert cache.get("nonexistent") is None
    assert cache.misses == 1


def test_cache_expiration():
    # TTL of 0.05 seconds
    cache = ResponseCache(max_size=10, default_ttl=0.05)
    cache.set("ephemeral", "temporary_value")

    assert cache.get("ephemeral") == "temporary_value"
    time.sleep(0.08)
    assert cache.get("ephemeral") is None


def test_cache_lru_eviction():
    cache = ResponseCache(max_size=2, default_ttl=60.0)
    cache.set("k1", "v1")
    cache.set("k2", "v2")
    # Access k1 to make k2 least recently used
    _ = cache.get("k1")

    # Adding third item should evict k2
    cache.set("k3", "v3")
    assert cache.get("k1") == "v1"
    assert cache.get("k3") == "v3"
    assert cache.get("k2") is None


def test_cache_invalidate_and_clear():
    cache = ResponseCache(max_size=10, default_ttl=60.0)
    cache.set("a", 1)
    cache.set("b", 2)

    assert cache.invalidate("a") is True
    assert cache.get("a") is None
    assert cache.get("b") == 2

    cache.clear()
    assert cache.get("b") is None
    assert cache.stats()["size"] == 0
