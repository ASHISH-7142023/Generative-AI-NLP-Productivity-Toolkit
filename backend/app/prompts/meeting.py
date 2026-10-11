"""Prompt builder for Meeting Notes Summarization."""

from typing import Optional


def build_meeting_summary_prompt(
    notes: str,
    style: Optional[str] = "standard",
) -> str:
    """Build a prompt instructing the model to generate a faithful meeting summary."""
    style_instruction = {
        "concise": "Provide a brief bulleted summary with high-priority highlights and immediate next steps.",
        "action-focused": "Emphasize blockers, who owns what task, and concrete actions to unblock progress.",
        "standard": "Balanced comprehensive summary capturing all participant updates and operational status.",
    }.get(style, "Standard balanced summary.")

    return f"""You are an executive project manager and meeting recorder.
Your task is to convert the raw meeting notes transcript into a structured, highly accurate executive meeting summary.

Raw Meeting Notes:
\"\"\"
{notes}
\"\"\"

Style Preference ({style}):
{style_instruction}

STRICT FACTUAL FIDELITY RULES:
1. Summarize ONLY what is present in the notes.
2. Preserve all stated names, figures, percentages, dates, and statuses with 100% accuracy (e.g. if Max states 'Profits up 50%', note exactly that Max reported a 50% profit increase).
3. Do NOT invent deadlines, commitments, corporate decisions, or task owners that were not stated.
4. If decisions or action items are not explicitly agreed in the notes, clearly state 'None explicitly recorded' rather than making assumptions.

Structure the Summary with clear Markdown headings:
## 1. Executive Overview
A concise 2-3 sentence overview of the meeting's topics and general status.

## 2. Key Updates & Progress
Bullet points attributing specific updates directly to participants (e.g. **Max**: ..., **Ruby**: ...).

## 3. Blockers, Risks & Dependencies
Highlight critical impediments mentioned, including who flagged them (e.g. **Kyle**: Software fix delays).

## 4. Support Offered & Cross-Team Assistance
Document any team members volunteering help or resources (e.g. **Walker**: Available to assist).

## 5. Decisions Recorded
List any confirmed decisions, or state if none were recorded.

## 6. Action Items & Next Steps
List concrete follow-up items with explicitly assigned owners, or indicate recommended next steps based on blockers.
"""
