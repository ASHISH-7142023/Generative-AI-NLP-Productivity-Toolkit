"""Data analysis service coordinating EDA and Visualization code generation."""

import re
from typing import Optional

from app.api.schemas import EDARequest, VisualizationRequest
from app.prompts.data_analysis import build_eda_prompt, build_visualization_prompt
from app.services.openai_service import OpenAIService, openai_service


def clean_code_output(raw_output: str) -> str:
    """Normalize generated code by removing unnecessary outer markdown fences if present."""
    trimmed = raw_output.strip()
    match = re.match(r"^```(?:python)?\s*\n([\s\S]*?)\n```$", trimmed, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return trimmed


class DataAnalysisService:
    """Coordinates prompt construction and generation for data analysis tasks."""

    def __init__(self, llm_service: OpenAIService = openai_service):
        self.llm_service = llm_service

    async def generate_eda_code(self, request: EDARequest) -> str:
        """Generate commented, runnable Python EDA code."""
        prompt = build_eda_prompt(
            dataset_description=request.dataset_description,
            filename=request.filename,
            analysis_goals=request.analysis_goals,
        )
        system_msg = (
            "You are an expert Python data analyst. Return runnable, safe, and clean "
            "Python code using pandas. Do not execute code; write it for the user to review."
        )
        raw_result = await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=0.2,
        )
        return clean_code_output(raw_result)

    async def generate_visualization_code(self, request: VisualizationRequest) -> str:
        """Generate commented, runnable Python visualization code using matplotlib and seaborn."""
        prompt = build_visualization_prompt(
            dataset_description=request.dataset_description,
            dataframe_name=request.dataframe_name,
            visualization_goal=request.visualization_goal,
            columns=request.columns,
        )
        system_msg = (
            "You are an expert Python visualization engineer. Write clean matplotlib and seaborn "
            "plotting code with titles, labels, tight layout, and plt.show()."
        )
        raw_result = await self.llm_service.generate_text(
            prompt=prompt,
            system_prompt=system_msg,
            temperature=0.2,
        )
        return clean_code_output(raw_result)


data_analysis_service = DataAnalysisService()
