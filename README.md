# Generative AI-Powered NLP Productivity Workspace

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg?logo=openai&logoColor=white)](https://platform.openai.com)
[![Pytest](https://img.shields.io/badge/pytest-14%20passed-green.svg)](https://docs.pytest.org)

**Infosys Springboard Capstone Project**  
A full-stack, enterprise-grade AI productivity application that coordinates natural language processing (NLP) pipelines through OpenAI models to automate four essential productivity workflows:
1. **Exploratory Data Analysis & Visualization Code Generator** (Pandas, Matplotlib, and Seaborn)
2. **Resume Generator** (Transforms experience paragraphs into structured resumes without fact fabrication)
3. **Programming Interview Question Generator** (Language, difficulty, and topic calibrated interview questions)
4. **Meeting Notes Summarizer** (Faithful executive synthesis identifying speaker updates, blockers, and action items)

---

## 🏛️ Architecture Overview

The application follows a clean decoupled client-server architecture:

```
┌────────────────────────────────┐         REST JSON        ┌────────────────────────────────┐
│   React 18 + TypeScript UI     │ ───────────────────────> │       FastAPI Backend          │
│   • Tailwind CSS Design Tokens │                          │   • Pydantic Request Guards    │
│   • Responsive App Shell       │ <─────────────────────── │   • Unified Error Handling     │
│   • Monospace Code Viewer      │         (Port 8000)      │   • Domain Prompt Builders     │
│   • Copy, Download & Print     │                          │   • OpenAI Async Client        │
└────────────────────────────────┘                          └────────────────────────────────┘
                                                                           │
                                                                           ▼
                                                            ┌────────────────────────────────┐
                                                            │          OpenAI API            │
                                                            │   • Configured via Backend     │
                                                            │   • Server-Side Keys Only      │
                                                            └────────────────────────────────┘
```

### Key Security & Responsible AI Guarantees:
- **Zero Client Key Exposure:** The `OPENAI_API_KEY` is kept strictly on the backend. Frontend network requests never carry or reveal provider credentials.
- **Code Non-Execution Safety:** All Python code generated for EDA and plotting is presented as formatted text with copy and `.py` export. Code is **never** executed automatically on the server.
- **Strict Factual Fidelity:** Prompts enforce strict adherence to user-provided facts—never hallucinating employers, qualifications, metrics, unrecorded decisions, or false task assignments.

---

## 📦 Project Structure

```text
GenerativeAINLPProductivityToolkit/
├── ARCHITECTURE_AND_DESIGN.md   # Architectural blueprint & specification
├── README.md                    # Setup and execution documentation
├── .env.example                 # Configuration template
├── .gitignore                   # Ignored virtual environments, node_modules, and secrets
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entrypoint, CORS, unified exception handlers
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings (OPENAI_MODEL, CORS, timeouts)
│   │   │   └── logging_config.py# Sanitized server-side diagnostics
│   │   ├── api/
│   │   │   ├── routes.py        # REST endpoints (/api/health, /api/generate/*, /api/summarize/*)
│   │   │   └── schemas.py       # Pydantic request & response models
│   │   ├── services/
│   │   │   ├── openai_service.py        # Centralized OpenAI async SDK client
│   │   │   ├── data_analysis_service.py # Pandas EDA & Matplotlib/Seaborn logic
│   │   │   ├── resume_service.py        # Factual resume generation
│   │   │   ├── interview_service.py     # Calibrated technical questions
│   │   │   └── meeting_service.py       # Executive meeting summarization
│   │   └── prompts/
│   │       ├── data_analysis.py # EDA & visualization prompt templates
│   │       ├── resume.py        # Resume prompt templates
│   │       ├── interview.py     # Interview question prompt templates
│   │       └── meeting.py       # Meeting notes prompt templates
│   ├── tests/
│   │   ├── test_health.py       # /api/health schema and secret leakage tests
│   │   ├── test_validation.py   # Boundary limits, blank inputs, and enum checks
│   │   └── test_routes.py       # Mocked end-to-end route tests for all 4 modules
│   └── requirements.txt
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── App.tsx              # Application shell & live backend status
        ├── index.css            # Tailwind directives & print styles
        ├── api/
        │   └── client.ts        # Centralized typed fetch client
        ├── components/
        │   ├── AppHeader.tsx    # Header with live health badge & model tag
        │   ├── Sidebar.tsx      # Multi-module navigation drawer
        │   ├── FeatureCard.tsx  # Interactive dashboard workflow cards
        │   ├── InputField.tsx   # Controlled inputs with character counting
        │   ├── ResultPanel.tsx  # Copy, export (.txt), and PDF print actions
        │   ├── CodeResult.tsx   # Monospace dark code viewer with .py export
        │   ├── LoadingState.tsx # Animated generation spinner
        │   └── ErrorMessage.tsx # Actionable error banner with setup guide
        ├── features/
        │   ├── dashboard/       # Overview landing view
        │   ├── data-analysis/   # EDA (Pandas) & Visualization tabs
        │   ├── resume/          # Experience narrative to resume
        │   ├── interview/       # Technical interview questions
        │   └── meeting/         # Raw notes to executive summary
        └── types/
            └── api.ts           # Shared TypeScript interfaces
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Python 3.11+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**
- **OpenAI API Key** (e.g. `sk-...`)

---

### Step 1: Backend Setup

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your environment variables:
   Create a `.env` file in `backend/.env` (or copy from `.env.example` in the root):
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   FRONTEND_ORIGIN=http://localhost:5173
   MAX_INPUT_CHARS=10000
   REQUEST_TIMEOUT_SECONDS=30.0
   APP_ENV=development
   ```
   > **Note:** If no key is set yet, the server will still boot and `/api/health` will respond. Any generation requests will display a helpful setup guidance alert.

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API will be accessible at: `http://localhost:8000`
   - Interactive Swagger API Documentation: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/api/health`

---

### Step 2: Frontend Setup

1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Web application opens at: `http://localhost:5173`

---

## 🧪 Testing & Validation

### Running Backend Automated Tests
All backend tests mock external OpenAI API calls, allowing the suite to run offline and reliably without incurring API costs.

From the `backend/` directory:
```bash
.venv\Scripts\pytest -v
```
**Test Results (14 passed):**
- `tests/test_health.py`: Validates `/api/health` response structure and confirms zero secret leakage.
- `tests/test_validation.py`: Tests blank inputs, boundary constraints (1-30 question limits), and invalid enum values.
- `tests/test_routes.py`: Validates mocked responses for all endpoints:
  - EDA Code Generation
  - Visualization Code Generation
  - Resume Generation
  - Interview Questions
  - Meeting Summarization (including test case: *Max, Ruby, Kyle, Walker, Parkman*)
  - 503 missing API key handling and 429 rate limit errors.

### Running Frontend Typechecks & Build Checks
From the `frontend/` directory:
```bash
npm run build
```
Executes TypeScript typechecking (`tsc`) followed by Vite production bundling into `frontend/dist/`.

---

## 🧭 Capstone Feature Demonstration Guide

### 1. Data Analysis Assistant (Module A)
- **EDA Tab:** Enter a description of your dataset (or click **"Load Sample Dataset"** to load student examination data). Click **Generate Pandas EDA Code** to inspect generated `read_csv()`, missing-value checks, summary statistics, and duplicate detection. Click **Save .py** to export.
- **Visualization Tab:** Enter the dataframe variable and column names. Click **Generate Plotting Code** to view Matplotlib/Seaborn code with readable figure sizes, Seaborn themes, titles, and `plt.show()`.

### 2. Resume Generator (Module B)
- Paste an unstructured paragraph about your career experience (or click **"Load Sample Profile"**).
- Select a target role and choose your desired depth style (`concise`, `standard`, or `detailed`).
- Click **Generate Resume** to produce a structured draft with Professional Summary, Skills, Experience (STAR method), and Education.
- Use **Copy**, **Download .txt**, or **Print / PDF** to export.

### 3. Programming Interview Question Generator (Module C)
- Choose from popular languages (Python, Java, TypeScript, C++, Go, Rust, SQL) or enter a custom language.
- Select difficulty (`Beginner`, `Intermediate`, `Advanced`) and question count (1 to 30).
- Optionally provide a concept (e.g. *OOP, Memory Management, Concurrency*).
- Toggle suggested answers and evaluation hints.
- Export generated questions via **Download .txt**.

### 4. Meeting Notes Summarizer (Module D)
- Paste conversation transcripts or click **"Load Capstone Example"** to populate the assignment sample:
  ```text
  Max: Profits up 50%
  Ruby: New servers are online
  Kyle: Need more time to fix software
  Walker: Happy to help
  Parkman: Beta testing almost done
  ```
- Click **Summarize Meeting** to review the executive summary neatly organized into:
  - **Executive Overview**
  - **Key Updates & Progress** (Max, Ruby)
  - **Blockers, Risks & Dependencies** (Kyle)
  - **Support Offered** (Walker)
  - **Decisions Recorded**
  - **Action Items & Next Steps**

---

## 📄 License
This project is open-source under the MIT License.