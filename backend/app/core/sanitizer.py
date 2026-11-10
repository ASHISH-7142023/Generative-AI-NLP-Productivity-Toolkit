"""Input sanitization and prompt injection defense utilities.

Provides defense-in-depth sanitization for user inputs before they are passed
into OpenAI prompt formatting templates.
"""

import html
import re
from typing import List, Tuple

# Common prompt injection signatures and control override phrases
PROMPT_INJECTION_PATTERNS: List[Tuple[str, str]] = [
    (r"(?i)ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", "[BLOCKED: INSTRUCTION_OVERRIDE]"),
    (r"(?i)system\s*prompt\s*override", "[BLOCKED: SYSTEM_OVERRIDE]"),
    (r"(?i)reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s*key)", "[BLOCKED: SYSTEM_EXFILTRATION]"),
    (r"(?i)you\s+are\s+now\s+in\s+(dan|developer|jailbreak)\s+mode", "[BLOCKED: JAILBREAK_MODE]"),
    (r"(?i)disregard\s+(all\s+)?guidelines", "[BLOCKED: GUIDELINE_OVERRIDE]"),
]

# Control character pattern (strip null bytes, non-printable controls, preserve newlines and tabs)
CONTROL_CHARS_PATTERN = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")


def sanitize_input_text(text: str, max_length: int = 10000, strip_injections: bool = True) -> str:
    """Sanitizes user input text before prompt construction.

    Args:
        text: The raw user-supplied string.
        max_length: Maximum allowed character length.
        strip_injections: Whether to redact known injection attack patterns.

    Returns:
        Cleaned, bounded, and sanitized text string.
    """
    if not text:
        return ""

    # Strip null bytes and dangerous control characters
    cleaned = CONTROL_CHARS_PATTERN.sub("", text)

    # Normalize unicode whitespace
    cleaned = cleaned.replace("\r\n", "\n").replace("\r", "\n")

    # Enforce maximum character boundary
    if len(cleaned) > max_length:
        cleaned = cleaned[:max_length]

    # Redact prompt injection markers if requested
    if strip_injections:
        for pattern, replacement in PROMPT_INJECTION_PATTERNS:
            cleaned = re.sub(pattern, replacement, cleaned)

    return cleaned.strip()


def detect_suspicious_patterns(text: str) -> List[str]:
    """Inspects text and returns a list of detected suspicious injection indicators.

    Args:
        text: Input text to analyze.

    Returns:
        List of identified security alerts (empty if text is benign).
    """
    findings: List[str] = []
    if not text:
        return findings

    for pattern, label in PROMPT_INJECTION_PATTERNS:
        if re.search(pattern, text):
            findings.append(label)

    return findings


def escape_html_entities(text: str) -> str:
    """Safely escapes HTML entities to prevent stored XSS when rendering raw text.

    Args:
        text: Plain text.

    Returns:
        HTML-escaped string.
    """
    return html.escape(text, quote=True)
