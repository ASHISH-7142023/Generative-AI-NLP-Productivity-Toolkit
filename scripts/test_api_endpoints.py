#!/usr/bin/env python3
"""
CLI validation utility to test running backend API endpoints.
Runs without third-party dependencies using standard library urllib.
"""

import json
import sys
import time
import urllib.error
import urllib.request

BASE_URL = "http://127.0.0.1:8000"

# ANSI Color Codes
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"


def request(method: str, path: str, payload: dict = None) -> tuple[int, dict, float]:
    url = f"{BASE_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload else None
    headers = {"Content-Type": "application/json"} if payload else {}

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    start = time.perf_counter()

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            elapsed = (time.perf_counter() - start) * 1000.0
            body = json.loads(resp.read().decode("utf-8"))
            return resp.status, body, elapsed
    except urllib.error.HTTPError as err:
        elapsed = (time.perf_counter() - start) * 1000.0
        try:
            body = json.loads(err.read().decode("utf-8"))
        except Exception:
            body = {"raw": str(err)}
        return err.code, body, elapsed
    except urllib.error.URLError as err:
        elapsed = (time.perf_counter() - start) * 1000.0
        return 0, {"error": f"Cannot connect to {BASE_URL}: {err.reason}"}, elapsed


def main():
    print(f"\n{BOLD}{BLUE}======================================================{RESET}")
    print(f"{BOLD}{BLUE}   NLP Productivity Toolkit - API Health & Endpoints Check{RESET}")
    print(f"{BOLD}{BLUE}======================================================{RESET}\n")

    endpoints = [
        ("GET", "/api/health", None, [200]),
        ("GET", "/api/system/metrics", None, [200]),
        (
            "POST",
            "/api/generate/eda",
            {
                "dataset_description": "Columns: id, age, fare, survived",
                "filename": "sample.csv",
                "eda_mode": "comprehensive",
            },
            [200, 503],
        ),
        (
            "POST",
            "/api/generate/visualization",
            {
                "dataset_description": "Columns: month, revenue",
                "dataframe_name": "df",
                "visualization_goal": "Monthly trend plot",
            },
            [200, 503],
        ),
        (
            "POST",
            "/api/generate/resume",
            {
                "experience": "Senior software engineer with 4 years Python and AWS experience.",
                "style": "concise",
            },
            [200, 503],
        ),
        (
            "POST",
            "/api/generate/interview-questions",
            {"language": "Python", "difficulty": "Intermediate", "count": 3},
            [200, 503],
        ),
        (
            "POST",
            "/api/summarize/meeting",
            {"notes": "Max: Profits up 50%\nRuby: Servers online", "style": "standard"},
            [200, 503],
        ),
        (
            "POST",
            "/api/generate/interview-questions",
            {"language": "Python", "count": 50},  # Invalid count > 30
            [422],
        ),
    ]

    passed = 0
    total = len(endpoints)

    print(f"{BOLD}{'METHOD':<7} {'PATH':<35} {'STATUS':<8} {'LATENCY':<10} {'RESULT'}{RESET}")
    print("-" * 75)

    for method, path, payload, expected_statuses in endpoints:
        status, body, latency = request(method, path, payload)
        is_ok = status in expected_statuses

        status_color = GREEN if is_ok else RED
        status_str = f"{status_color}{status:<8}{RESET}"
        latency_str = f"{latency:6.1f}ms"
        result_icon = f"{GREEN}PASS{RESET}" if is_ok else f"{RED}FAIL{RESET}"

        if is_ok:
            passed += 1

        print(f"{method:<7} {path:<35} {status_str} {latency_str:<10} {result_icon}")

    print("-" * 75)
    print(f"\n{BOLD}Result: {passed}/{total} endpoint checks succeeded.{RESET}\n")

    if passed != total:
        sys.exit(1)


if __name__ == "__main__":
    main()
