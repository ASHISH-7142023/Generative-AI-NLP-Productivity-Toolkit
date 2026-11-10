"""In-memory thread-safe LRU response cache with TTL.

Caches deterministic AI responses to reduce latency and token spend on repeated queries.
"""

from collections import OrderedDict
from hashlib import sha256
import json
import threading
import time
from typing import Any, Dict, Optional


class CacheEntry:
    __slots__ = ("value", "expires_at")

    def __init__(self, value: Any, ttl_seconds: float):
        self.value = value
        self.expires_at = time.time() + ttl_seconds

    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class ResponseCache:
    """Thread-safe in-memory LRU cache with time-to-live expiration."""

    def __init__(self, max_size: int = 500, default_ttl: float = 300.0):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self._lock = threading.Lock()
        self.hits: int = 0
        self.misses: int = 0

    @staticmethod
    def generate_key(prefix: str, payload: Dict[str, Any]) -> str:
        """Computes a deterministic SHA-256 hash key from a payload dictionary."""
        serialized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        digest = sha256(serialized.encode("utf-8")).hexdigest()[:16]
        return f"{prefix}:{digest}"

    def get(self, key: str) -> Optional[Any]:
        """Retrieves an item from cache. Returns None on miss or expiration."""
        with self._lock:
            entry = self._cache.get(key)
            if entry is None:
                self.misses += 1
                return None

            if entry.is_expired():
                del self._cache[key]
                self.misses += 1
                return None

            # Move to end to maintain LRU order
            self._cache.move_to_end(key)
            self.hits += 1
            return entry.value

    def set(self, key: str, value: Any, ttl_seconds: Optional[float] = None) -> None:
        """Stores a value in the cache with optional custom TTL."""
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        with self._lock:
            # Evict expired entries if approaching capacity
            if len(self._cache) >= self.max_size:
                # Remove oldest item (LRU)
                self._cache.popitem(last=False)

            self._cache[key] = CacheEntry(value, ttl)
            self._cache.move_to_end(key)

    def invalidate(self, key: str) -> bool:
        """Removes a specific key from the cache."""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False

    def clear(self) -> None:
        """Clears all cached entries and resets statistics."""
        with self._lock:
            self._cache.clear()
            self.hits = 0
            self.misses = 0

    def stats(self) -> Dict[str, Any]:
        """Returns cache telemetry statistics."""
        with self._lock:
            total_lookups = self.hits + self.misses
            hit_ratio = round((self.hits / total_lookups) * 100, 2) if total_lookups > 0 else 0.0
            return {
                "size": len(self._cache),
                "max_size": self.max_size,
                "hits": self.hits,
                "misses": self.misses,
                "hit_ratio_percent": hit_ratio,
            }


# Global application cache instance
app_cache = ResponseCache(max_size=500, default_ttl=300.0)
