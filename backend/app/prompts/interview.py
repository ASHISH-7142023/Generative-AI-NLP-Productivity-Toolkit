"""Prompt builder for Programming Interview Question Generator."""

from typing import Optional


def build_interview_prompt(
    language: str,
    difficulty: str,
    count: int,
    topic: Optional[str] = None,
    include_answers: Optional[bool] = True,
) -> str:
    """Build a prompt instructing the model to generate tailored programming interview questions."""
    topic_clause = f"\nFocus Topic: {topic}" if topic else ""
    answer_clause = (
        "For each question, provide:\n"
        "   - **Evaluation Rubric:** Core concepts being tested and what signals a strong vs weak candidate.\n"
        "   - **Suggested Solution:** Clear explanation with runnable code example in " + language + ".\n"
        "   - **Complexity Analysis:** Expected Big-O time and space complexity.\n"
        "   - **Hint Ladder:** A 2-tier hint ladder (Gentle nudge -> Structural approach) for interviewers to offer struggling candidates.\n"
        "Clearly demarcate each question and its rubric/solution."
        if include_answers
        else "Provide only the questions without answers."
    )

    return f"""You are a senior technical interviewer and engineering lead.
Your task is to generate exactly {count} distinct technical interview questions for the programming language: {language}.

Parameters:
- Target Programming Language: {language}
- Difficulty Level: {difficulty}
- Total Questions Needed: {count}
{topic_clause}

Requirements:
1. Generate exactly {count} distinct, numbered questions (from 1 to {count}).
2. Calibrate difficulty accurately for '{difficulty}':
   - Beginner: Core syntax, basic data structures, fundamental concepts, error handling.
   - Intermediate: Memory management, OOP/functional patterns, concurrency, algorithms, standard libraries, edge cases.
   - Advanced: Low-level internals, optimization, distributed design patterns, tricky language quirks, profiling.
3. Mix conceptual questions and practical coding/problem-solving tasks where appropriate.
4. Avoid duplicate, repetitive, or ambiguous questions.
5. {answer_clause}
6. Format clearly using Markdown (e.g. ### Question 1, **Category:**, **Question:**, **Suggested Answer/Hint:**).
"""
