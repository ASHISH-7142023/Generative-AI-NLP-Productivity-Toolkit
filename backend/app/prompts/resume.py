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


def build_cover_letter_prompt(
    experience: str,
    job_description: str,
    company_name: Optional[str] = "Hiring Team",
    tone: Optional[str] = "professional",
) -> str:
    """Build a prompt instructing the model to generate a targeted, ATS-aligned cover letter."""
    tone_guidelines = {
        "professional": "Polished, formal, and courteous tone suitable for corporate environments.",
        "enthusiastic": "Dynamic, forward-looking, and passionate tone showcasing strong company alignment.",
        "executive": "Strategic, outcome-driven tone emphasizing leadership, scale, and organizational impact.",
        "technical": "Precise, engineering-focused tone emphasizing architectures, tooling, and concrete problem-solving.",
    }.get(tone or "professional", "Professional and engaging tone.")

    return f"""You are an executive career strategist and talent acquisition expert.
Your task is to write a compelling, tailored cover letter aligning the candidate's actual experience with the target job requirements.

Target Company / Employer:
{company_name or 'Hiring Team'}

Target Job Description & Requirements:
{job_description}

Candidate's Actual Experience & Accomplishments:
{experience}

Tone Specification ({tone}):
{tone_guidelines}

STRICT FACTUAL INTEGRITY & ATS RULES:
1. Ground every claim strictly in the candidate's supplied accomplishments. NEVER fabricate experiences, technologies, or outcomes.
2. Naturally incorporate relevant keywords and qualification phrases from the job description that truthfully match the candidate's background.
3. Structure the cover letter into 4 impactful sections:
   - Strong Opening: Hook expressing enthusiasm for the specific role at {company_name or 'the company'}.
   - Core Value Alignment: 2-3 focused paragraphs demonstrating how candidate's stated achievements solve key challenges in the job description.
   - Culture & Impact: Why this position aligns with the candidate's trajectory.
   - Confident Call to Action: Courteous closing requesting an interview conversation.
4. Output the complete letter in clean Markdown format with date and placeholder contact header.
"""

