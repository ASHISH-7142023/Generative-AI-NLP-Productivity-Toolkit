"""Prompt templates and builders for Pandas EDA and Matplotlib/Seaborn Visualizations."""

from typing import Optional


def build_eda_prompt(
    dataset_description: str,
    filename: Optional[str] = "dataset.csv",
    analysis_goals: Optional[str] = None,
) -> str:
    """Build a prompt instructing the model to generate Pandas EDA code."""
    file_spec = f"'{filename}'" if filename else "'dataset.csv'"
    goals_clause = f"\nSpecific Analysis Goals:\n{analysis_goals}" if analysis_goals else ""

    return f"""You are an expert Python Data Analyst.
Your task is to write clean, runnable, commented Python code for Exploratory Data Analysis (EDA) using the pandas library based on the user's dataset description.

Dataset Description:
{dataset_description}

Target File Name:
{file_spec}
{goals_clause}

Strict Instructions:
1. Generate valid, clean, commented Python code.
2. Include all necessary imports (e.g. import pandas as pd, import numpy as np).
3. Show how to load the dataset using pd.read_csv({file_spec}) with comments explaining any optional parsing (e.g. encoding, parse_dates).
4. Perform standard EDA steps in a logical sequence:
   - Preview dataset: df.head(), df.tail()
   - Dimension & metadata: df.shape, df.columns, df.info(), df.dtypes
   - Missing value analysis: df.isnull().sum() and percentage missing
   - Duplicate records check: df.duplicated().sum()
   - Summary statistics: df.describe(include='all')
   - Value counts on categorical columns if applicable
5. Do NOT invent specific column names unless they were explicitly described by the user. If the schema is unknown or generic, use generic patterns like df.select_dtypes(include='number') or inspect df.columns programmatically.
6. Return only runnable Python code with clear comments. You may wrap the code in a ```python ... ``` block.
"""


def build_visualization_prompt(
    dataset_description: str,
    dataframe_name: Optional[str] = "df",
    visualization_goal: Optional[str] = None,
    columns: Optional[str] = None,
) -> str:
    """Build a prompt instructing the model to generate Matplotlib and Seaborn plotting code."""
    df_name = dataframe_name if dataframe_name else "df"
    goal_clause = f"\nVisualization Goal:\n{visualization_goal}" if visualization_goal else ""
    col_clause = f"\nKnown Columns:\n{columns}" if columns else ""

    return f"""You are an expert Python Data Visualization Specialist.
Your task is to write clean, production-grade Python visualization code using matplotlib.pyplot and seaborn based on the user's dataset description.

Dataset Description:
{dataset_description}

DataFrame Variable:
{df_name}
{goal_clause}
{col_clause}

Strict Instructions:
1. Include all necessary imports: import matplotlib.pyplot as plt, import seaborn as sns, import pandas as pd.
2. Set a modern, clean seaborn style: sns.set_theme(style="whitegrid") or similar.
3. For each plot:
   - Specify a readable figure size: plt.figure(figsize=(10, 6))
   - Include descriptive title, xlabel, and ylabel
   - Call plt.tight_layout()
   - Call plt.show()
4. Select appropriate chart types for the described data (e.g., distribution histograms/KDE, bar charts for categories, scatter plots or line plots for relationships, and correlation heatmap using df.select_dtypes(include='number').corr()).
5. Guard against missing or non-numeric columns (e.g. ensure numeric data exists before computing a correlation matrix).
6. Do NOT reference columns that were not described; use generic placeholders or programmatic column selection where schema is unspecified.
7. Return only runnable Python code with helpful comments. You may wrap the code in a ```python ... ``` block.
"""
