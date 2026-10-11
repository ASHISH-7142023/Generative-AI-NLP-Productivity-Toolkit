"""Prompt builder for Resume Generation from candidate paragraphs."""

from typing import Optional


def build_resume_prompt(
    experience: str,
    target_role: Optional[str] = None,
    style: Optional[str] = "standard",
) -> str:
    """Build a prompt instructing the model to generate a professional, factual resume."""
    role_clause = f"\nTarget Role:\n{target_role}" if target_role else ""

    style_guide = {
        "concise": "Keep bullet points brief, high-impact, and limited to 2-3 key highlights per role.",
        "detailed": "Provide thorough bullet points detailing responsibilities, technical stacks used, and outcomes.",
        "standard": "Balanced professional tone with clear action verbs and quantifiable results where provided.",
    }.get(style, "Standard professional tone.")

    return f"""You are an executive resume writer and career coach.
Your task is to transform the provided candidate background paragraph into a polished, structured professional resume.

Candidate Background Information:
{experience}
{role_clause}

Style Guide ({style}):
{style_guide}

STRICT FACTUAL INTEGRITY RULES:
1. NEVER invent, fabricate, or assume employers, job titles, educational institutions, dates, metrics, awards, or certifications.
2. Use ONLY facts explicitly provided by the user.
3. If information for a section (such as Education or Certifications) is not mentioned in the candidate background, omit that section entirely or include a brief note such as '[Add your education details here]'. Do NOT make assumptions.
4. Transform raw text into strong, action-oriented bullet points using the STAR method (Situation, Task, Action, Result) based strictly on stated accomplishments.

Structure the Resume using clear Markdown headings:
# [Candidate Name or Professional Title]
## Professional Summary
## Technical & Professional Skills
## Professional Experience / Internships
## Key Projects
## Education & Certifications (if provided)

Return the formatted resume directly in clean Markdown format.
"""
