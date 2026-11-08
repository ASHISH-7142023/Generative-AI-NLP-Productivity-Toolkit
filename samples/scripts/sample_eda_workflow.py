"""
Sample Exploratory Data Analysis & Visualization Script
Generated via Generative AI NLP Productivity Toolkit (Module A)
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns


def main():
    # 1. Environment and Visual Theme Configuration
    sns.set_theme(style="whitegrid", palette="deep")
    plt.rcParams["figure.autolayout"] = True

    # 2. Dataset Ingestion
    dataset_path = "samples/data/sales_performance.csv"
    print(f"Loading dataset from: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path, parse_dates=["date"])
    except FileNotFoundError:
        print("Sample data file not found. Generating in-memory surrogate DataFrame.")
        df = pd.DataFrame({
            "region": ["North America", "Europe", "Asia Pacific", "Latin America"] * 10,
            "units_sold": np.random.randint(5, 50, 40),
            "revenue": np.random.uniform(1000, 8000, 40),
            "discount_percent": np.random.uniform(0.0, 0.15, 40),
        })

    # 3. Structure & Schema Inspection
    print("\n--- DataFrame Head ---")
    print(df.head())

    print("\n--- Shape & Data Types ---")
    print(f"Dimensions: {df.shape[0]} rows x {df.shape[1]} columns")
    print(df.dtypes)

    # 4. Data Quality & Missing Value Assessment
    print("\n--- Missing Values Audit ---")
    missing_summary = pd.DataFrame({
        "Missing Count": df.isnull().sum(),
        "Missing %": (df.isnull().sum() / len(df)) * 100
    })
    print(missing_summary)

    # 5. Descriptive Statistical Profiling
    print("\n--- Numerical Summary Statistics ---")
    print(df.describe())

    # 6. Exploratory Visualizations
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    if "revenue" in df.columns and "region" in df.columns:
        plt.figure(figsize=(10, 6))
        sns.barplot(data=df, x="region", y="revenue", estimator=np.sum, errorbar=None, hue="region", legend=False)
        plt.title("Total Revenue by Geographic Region", fontsize=14, fontweight="bold")
        plt.xlabel("Region", fontsize=12)
        plt.ylabel("Total Revenue (USD)", fontsize=12)
        plt.tight_layout()
        print("\nDisplaying Region Revenue Plot...")
        # plt.show()  # Uncomment when executing locally in an interactive terminal

    if len(numeric_cols) > 1:
        plt.figure(figsize=(8, 6))
        corr_matrix = df[numeric_cols].corr()
        sns.heatmap(corr_matrix, annot=True, cmap="mako", fmt=".2f", linewidths=0.5)
        plt.title("Correlation Matrix of Numerical Metrics", fontsize=14, fontweight="bold")
        plt.tight_layout()
        print("Displaying Numerical Correlation Matrix...")
        # plt.show()


if __name__ == "__main__":
    main()
