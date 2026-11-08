"""Unit tests for prompt builder functions ensuring proper formatting and constraint rules."""

from app.prompts.data_analysis import build_eda_prompt, build_visualization_prompt
from app.prompts.resume import build_resume_prompt
from app.prompts.interview import build_interview_prompt
from app.prompts.meeting import build_meeting_summary_prompt


def test_build_eda_prompt_structure():
    """Verify EDA prompt includes core instructions, target filename, and mode."""
    prompt = build_eda_prompt(
        dataset_description="Columns: id, age, fare, survived",
        filename="titanic.csv",
        analysis_goals="Inspect survival correlation",
        eda_mode="correlation_profiling",
    )
    assert "titanic.csv" in prompt
    assert "CORRELATION_PROFILING" in prompt
    assert "Inspect survival correlation" in prompt
    assert "pd.read_csv" in prompt
    assert "df.describe" in prompt


def test_build_visualization_prompt_structure():
    """Verify visualization prompt specifies seaborn style, plotting libraries, and target dataframe."""
    prompt = build_visualization_prompt(
        dataset_description="Sales by region over months",
        dataframe_name="sales_df",
        visualization_goal="Monthly revenue line chart",
        columns="month, region, revenue",
    )
    assert "sales_df" in prompt
    assert "matplotlib.pyplot" in prompt
    assert "seaborn" in prompt
    assert "Monthly revenue line chart" in prompt
    assert "month, region, revenue" in prompt


def test_build_resume_prompt_fidelity():
    """Verify resume prompt enforces strict zero-hallucination rules and formatting sections."""
    prompt = build_resume_prompt(
        experience="Software engineer at Acme Corp with 4 years Python and AWS experience.",
        target_role="Senior Backend Engineer",
        style="standard",
    )
    assert "Acme Corp" in prompt
    assert "Senior Backend Engineer" in prompt
    assert "STRICT FACTUAL FIDELITY RULES" in prompt
    assert "Do NOT invent" in prompt
    assert "Professional Summary" in prompt


def test_build_interview_prompt_calibration():
    """Verify interview prompt specifies calibrated difficulty, question count, and hint ladders."""
    prompt = build_interview_prompt(
        language="Go",
        difficulty="Advanced",
        count=7,
        topic="Goroutines and Channels",
        include_answers=True,
    )
    assert "Go" in prompt
    assert "Advanced" in prompt
    assert "exactly 7 distinct" in prompt
    assert "Goroutines and Channels" in prompt
    assert "Hint Ladder" in prompt
    assert "Evaluation Rubric" in prompt


def test_build_meeting_summary_fidelity():
    """Verify meeting summary prompt preserves speaker names and specifies structured sections."""
    raw_notes = "Max: Profits up 50%\nRuby: New servers are online\nKyle: Need more time to fix software"
    prompt = build_meeting_summary_prompt(notes=raw_notes, style="action-focused")
    assert "Max: Profits up 50%" in prompt
    assert "Executive Overview" in prompt
    assert "Blockers, Risks & Dependencies" in prompt
    assert "Action Items & Next Steps" in prompt
    assert "STRICT FACTUAL FIDELITY RULES" in prompt
