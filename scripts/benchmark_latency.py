"""Latency and throughput benchmarking script for the FastAPI backend.

Usage:
    python scripts/benchmark_latency.py [--url http://localhost:8000] [--concurrency 5] [--requests 20]
"""

import argparse
import asyncio
import json
import statistics
import time
from typing import List, Tuple
import urllib.request
import urllib.error


def sync_post_request(url: str, payload: dict, timeout: float = 30.0) -> Tuple[float, int]:
    """Sends a synchronous POST request and returns (elapsed_seconds, status_code)."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "ToolkitBenchmark/1.0"},
        method="POST",
    )
    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status = response.getcode()
    except urllib.error.HTTPError as e:
        status = e.code
    except Exception:
        status = 0
    elapsed = time.perf_counter() - start
    return elapsed, status


async def run_benchmark(base_url: str, concurrency: int, total_requests: int):
    print("=" * 65)
    print(f"  API Latency & Throughput Benchmark")
    print(f"  Target: {base_url}")
    print(f"  Concurrency: {concurrency} | Total Requests: {total_requests}")
    print("=" * 65)

    test_endpoint = f"{base_url.rstrip('/')}/api/generate/interview-questions"
    payload = {
        "language": "Python",
        "difficulty": "Beginner",
        "count": 2,
        "topic": "List Comprehensions",
    }

    loop = asyncio.get_running_loop()
    semaphore = asyncio.Semaphore(concurrency)

    async def worker() -> Tuple[float, int]:
        async with semaphore:
            return await loop.run_in_executor(None, sync_post_request, test_endpoint, payload)

    start_total = time.perf_counter()
    tasks = [worker() for _ in range(total_requests)]
    results: List[Tuple[float, int]] = await asyncio.gather(*tasks)
    total_time = time.perf_counter() - start_total

    latencies = [r[0] for r in results]
    successes = sum(1 for r in results if 200 <= r[1] < 300)
    failures = total_requests - successes

    latencies.sort()
    p50 = statistics.median(latencies)
    p95 = latencies[int(len(latencies) * 0.95)] if len(latencies) > 1 else latencies[0]
    p99 = latencies[int(len(latencies) * 0.99)] if len(latencies) > 1 else latencies[0]

    print(f"\nResults Summary:")
    print(f"  Total Duration   : {total_time:.2f}s")
    print(f"  Requests / Sec   : {(total_requests / total_time):.2f} req/s")
    print(f"  Success Rate     : {(successes / total_requests * 100):.1f}% ({successes}/{total_requests})")
    print(f"  Failure Count    : {failures}")
    print(f"\nLatency Distribution:")
    print(f"  Min Latency      : {min(latencies):.4f}s")
    print(f"  Mean Latency     : {statistics.mean(latencies):.4f}s")
    print(f"  p50 (Median)     : {p50:.4f}s")
    print(f"  p95              : {p95:.4f}s")
    print(f"  p99              : {p99:.4f}s")
    print(f"  Max Latency      : {max(latencies):.4f}s")
    print("=" * 65)


def main():
    parser = argparse.ArgumentParser(description="Toolkit Backend Benchmark Tool")
    parser.add_argument("--url", default="http://localhost:8000", help="Base URL")
    parser.add_argument("--concurrency", type=int, default=3, help="Concurrent workers")
    parser.add_argument("--requests", type=int, default=6, help="Total requests to dispatch")
    args = parser.parse_args()

    asyncio.run(run_benchmark(args.url, args.concurrency, args.requests))


if __name__ == "__main__":
    main()
