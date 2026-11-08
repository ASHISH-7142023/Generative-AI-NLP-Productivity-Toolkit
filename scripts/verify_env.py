#!/usr/bin/env python3
"""
Environment and dependency diagnostic utility.
Verifies system prerequisites, configuration files, and local service ports.
"""

import os
import shutil
import socket
import subprocess
import sys

# ANSI Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"


def check_python_version() -> bool:
    v = sys.version_info
    print(f"[*] Python Version: {v.major}.{v.minor}.{v.micro}", end=" ")
    if (v.major, v.minor) >= (3, 10):
        print(f"{GREEN}[OK]{RESET}")
        return True
    print(f"{RED}[FAIL: Requires Python >= 3.10]{RESET}")
    return False


def check_node_version() -> bool:
    node_bin = shutil.which("node")
    if not node_bin:
        print(f"[*] Node.js: {YELLOW}[NOT FOUND in PATH]{RESET}")
        return False
    try:
        out = subprocess.check_output([node_bin, "--version"], text=True).strip()
        print(f"[*] Node.js Version: {out}", end=" ")
        major = int(out.lstrip("v").split(".")[0])
        if major >= 18:
            print(f"{GREEN}[OK]{RESET}")
            return True
        print(f"{YELLOW}[WARNING: Recommended Node >= 18]{RESET}")
        return True
    except Exception as e:
        print(f"[*] Node.js check error: {e}")
        return False


def check_env_files() -> bool:
    env_example = os.path.exists(".env.example")
    env_file = os.path.exists(".env") or os.path.exists("backend/.env")

    print(f"[*] Configuration .env.example: {GREEN if env_example else RED}[{'FOUND' if env_example else 'MISSING'}]{RESET}")
    print(f"[*] Runtime .env file: {GREEN if env_file else YELLOW}[{'CONFIGURED' if env_file else 'NOT FOUND - copy from .env.example'}]{RESET}")
    return env_example


def check_port(host: str, port: int, service_name: str):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        s.connect((host, port))
        s.close()
        print(f"[*] Port {port} ({service_name}): {GREEN}[ACTIVE / LISTENING]{RESET}")
    except Exception:
        print(f"[*] Port {port} ({service_name}): {YELLOW}[FREE / NOT RUNNING]{RESET}")


def main():
    print(f"\n{BOLD}{BLUE}======================================================{RESET}")
    print(f"{BOLD}{BLUE}    NLP Productivity Toolkit - Environment Preflight   {RESET}")
    print(f"{BOLD}{BLUE}======================================================{RESET}\n")

    py_ok = check_python_version()
    node_ok = check_node_version()
    env_ok = check_env_files()

    print("\n--- Port Diagnostics ---")
    check_port("127.0.0.1", 8000, "FastAPI Backend")
    check_port("127.0.0.1", 5173, "Vite Frontend")

    print("\n------------------------")
    if py_ok and env_ok:
        print(f"{GREEN}{BOLD}Preflight check passed successfully!{RESET}\n")
    else:
        print(f"{YELLOW}{BOLD}Preflight completed with notices. Review items above.{RESET}\n")


if __name__ == "__main__":
    main()
