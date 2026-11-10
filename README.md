# Generative AI-Powered NLP Productivity Workspace

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg?logo=openai&logoColor=white)](https://platform.openai.com)
[![Backend CI](https://img.shields.io/github/actions/workflow/status/ASHISH-7142023/Generative-AI-NLP-Productivity-Toolkit/backend-ci.yml?label=Backend%20CI&logo=github)](https://github.com/ASHISH-7142023/Generative-AI-NLP-Productivity-Toolkit/actions)
[![Frontend CI](https://img.shields.io/github/actions/workflow/status/ASHISH-7142023/Generative-AI-NLP-Productivity-Toolkit/frontend-ci.yml?label=Frontend%20CI&logo=github)](https://github.com/ASHISH-7142023/Generative-AI-NLP-Productivity-Toolkit/actions)
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
│   React 18 + TypeScript UI     │ ─────────────────────── >│       FastAPI Backend          │
│   • Tailwind CSS Design Tokens │                          │   • Pydantic Request Guards    │
│   • Responsive App Shell       │ <─────────────────────── │   • Unified Error Handling     │
│   • Spline 3D Hero Scene       │         (Port 8000)      │   • Domain Prompt Builders     │
│   • Copy, Download & Print     │                          │   • OpenAI Async Client        │
│   • Dark Mode + Toast Alerts   │                          │   • Rate Limiting Middleware   │
└────────────────────────────────┘                          └────────────────────────────────┘
                                                                           │
                                                                           ▼
                                                            ┌────────────────────────────────┐
                                                            │          OpenAI API            │
                                                            │   • Configured via Backend     │
                                                            │   • Server-Side Keys Only      │
                                                            │   • Retry + Fallback Logic     │
                                                            └────────────────────────────────┘
```

### Key Security & Responsible AI Guarantees
- **Zero Client Key Exposure:** `OPENAI_API_KEY` is kept strictly on the backend. Frontend network requests never carry or reveal provider credentials.
- **Code Non-Execution Safety:** All Python code generated for EDA and plotting is presented as formatted text with copy and `.py` export. Code is **never** executed automatically on the server.
- **Strict Factual Fidelity:** Prompts enforce strict adherence to user-provided facts—never hallucinating employers, qualifications, metrics, unrecorded decisions, or false task assignments.
- **Request Correlation:** Every request is tagged with a unique `X-Request-ID` header for end-to-end tracing.
- **In-Memory Rate Limiting:** 60 req/min per IP cap prevents abuse without requiring external infra.
- **Security Headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` on every response.

---

## 📦 Project Structure

```text
Generative-AI-NLP-Productivity-Toolkit/
├── ARCHITECTURE_AND_DESIGN.md   # Architectural blueprint & specification
├── README.md                    # Setup and execution documentation (this file)
├── Makefile                     # Developer shortcuts (dev, test, lint, build, clean)
├── .env.example                 # Configuration template
├── .gitignore                   # Ignored virtual environments, node_modules, and secrets
├── .github/
│   └── workflows/
│       ├── backend-ci.yml       # GitHub Actions: pytest across Python 3.10–3.12
│       └── frontend-ci.yml      # GitHub Actions: Vitest + tsc + build on Node 18/20
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint, CORS, middleware, exception handlers
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings (all env vars with defaults)
│   │   │   ├── logging_config.py# JSON-structured log formatter for production
│   │   │   ├── middleware.py    # RequestID + process-time correlation middleware
│   │   │   └── security.py     # SecurityHeaders + InMemoryRateLimiter middleware
│   │   ├── api/
│   │   │   ├── routes.py        # REST endpoints: /api/health, /api/generate/*, /api/system/metrics
│   │   │   └── schemas.py       # Pydantic request & response models with UsageMetadata
│   │   ├── services/
│   │   │   ├── openai_service.py        # Async OpenAI client with retry + model fallback
│   │   │   ├── data_analysis_service.py # EDA profiling presets & temperature support
│   │   │   ├── resume_service.py        # Factual resume generation
│   │   │   ├── interview_service.py     # Calibrated questions with hint ladders
│   │   │   └── meeting_service.py       # Executive summary with action-item priorities
│   │   └── prompts/
│   │       ├── data_analysis.py # EDA & visualization prompt templates (eda_mode aware)
│   │       ├── resume.py        # Resume prompt templates
│   │       ├── interview.py     # Interview prompt with complexity rubrics
│   │       └── meeting.py       # Meeting prompt with priority/owner tags
│   ├── tests/
│   │   ├── conftest.py          # Shared pytest fixtures & AsyncClient setup
│   │   ├── test_health.py       # /api/health schema and secret leakage tests
│   │   ├── test_validation.py   # Boundary limits, blank inputs, and enum checks
│   │   ├── test_routes.py       # Mocked end-to-end route tests for all 4 modules
│   │   ├── test_middleware.py   # Request-ID and security header middleware tests
│   │   ├── test_prompts.py      # Prompt builder unit tests and edge cases
│   │   ├── test_meeting_summary.py # Multi-speaker meeting integration tests
│   │   └── test_interview.py    # Interview question boundary and validation tests
│   ├── pyproject.toml
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts         # Vitest + jsdom test environment
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── App.tsx              # Application shell & live backend status
│       ├── index.css            # Tailwind directives, dark mode tokens & print styles
│       ├── api/
│       │   ├── client.ts        # Centralized typed fetch client
│       │   └── __tests__/
│       │       └── client.test.ts  # API client unit tests
│       ├── components/
│       │   ├── AppHeader.tsx    # Header with live health badge & model tag
│       │   ├── Sidebar.tsx      # Multi-module navigation drawer
│       │   ├── FeatureCard.tsx  # Interactive dashboard workflow cards
│       │   ├── InputField.tsx   # Controlled inputs with character counting
│       │   ├── ResultPanel.tsx  # Copy, export (.txt), and PDF print actions
│       │   ├── CodeResult.tsx   # Monospace dark code viewer with .py export
│       │   ├── LoadingState.tsx # Animated generation spinner
│       │   ├── ErrorMessage.tsx # Actionable error banner with setup guide
│       │   ├── ErrorBoundary.tsx# React error boundary for graceful fallback
│       │   ├── Toast.tsx        # Lightweight toast notification system
│       │   ├── ExportDropdown.tsx # Multi-format export dropdown
│       │   └── __tests__/
│       │       ├── FeatureCard.test.tsx # FeatureCard component unit tests
│       │       └── InputField.test.tsx  # InputField component unit tests
│       ├── context/
│       │   └── ToastContext.tsx # Global toast state provider
│       ├── hooks/
│       │   └── useKeyboardShortcuts.ts # Alt+1–5 and Alt+D global nav shortcuts
│       ├── features/
│       │   ├── dashboard/       # Overview landing view with Spline 3D scene
│       │   ├── data-analysis/   # EDA (Pandas) & Visualization tabs
│       │   ├── resume/          # Experience narrative to resume
│       │   ├── interview/       # Technical interview questions
│       │   └── meeting/         # Raw notes to executive summary
│       ├── test/
│       │   └── setup.ts         # Vitest setup: @testing-library/jest-dom matchers
│       └── types/
│           └── api.ts           # Shared TypeScript interfaces with discriminated unions
├── samples/
│   ├── data/
│   │   ├── sales_performance.csv      # Sample CSV for EDA testing
│   │   └── customer_churn.json        # Sample JSON for data analysis
│   ├── transcripts/
│   │   └── standup_meeting.txt        # Multi-speaker standup for meeting summarizer
│   ├── resumes/
│   │   └── raw_experience_fullstack.txt # Raw experience text for resume generator
│   └── scripts/
│       └── sample_eda_workflow.py     # End-to-end pandas EDA export template
└── scripts/
    ├── test_api_endpoints.py          # CLI API validation script with colored output
    └── verify_env.py                  # Project environment sanity checker
```

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Python 3.11+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**
- **OpenAI API Key** (e.g. `sk-...`)
- *(Optional)* **GNU Make** for `make` shortcuts

---

### Option A — Using Make (Recommended)

```bash
# 1. Install all dependencies (backend + frontend)
make install

# 2. Configure environment (copy & edit)
cp .env.example backend/.env   # then set OPENAI_API_KEY inside

# 3. Start backend (port 8000) in one terminal
make dev-backend

# 4. Start frontend (port 5173) in another terminal
make dev-frontend
```

---

### Option B — Manual Setup

#### Step 1: Backend Setup

```bash
cd backend

# Using uv (fastest):
pip install uv
uv sync
uv run uvicorn app.main:app --reload --port 8000

# Or classic venv:
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1  |  macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Create `backend/.env`:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_FALLBACK_MODEL=gpt-3.5-turbo
OPENAI_MAX_RETRIES=3
FRONTEND_ORIGIN=http://localhost:5173
MAX_INPUT_CHARS=10000
REQUEST_TIMEOUT_SECONDS=30.0
APP_ENV=development
LOG_FORMAT=json
```

> **Note:** If no key is set, the server will still boot and `/api/health` will respond. Any generation request will display a helpful setup guidance alert in the UI.

#### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Web application opens at `http://localhost:5173`

---

## 🧪 Testing & Validation

### Backend Tests

All backend tests mock external OpenAI API calls — the suite runs **offline** without incurring API costs.

```bash
# From repo root (using make):
make test-backend

# Or manually from backend/:
cd backend
python -m pytest tests/ -v --tb=short
```

**Test coverage (14+ tests across 7 files):**

| File | What it covers |
|------|---------------|
| `tests/test_health.py` | `/api/health` schema; confirms zero secret leakage |
| `tests/test_validation.py` | Blank inputs, boundary limits (1–30 questions), invalid enums |
| `tests/test_routes.py` | Mocked end-to-end routes for all 4 modules; 503/429 error paths |
| `tests/test_middleware.py` | `X-Request-ID` header; `X-Process-Time` injection; security headers |
| `tests/test_prompts.py` | Prompt builder unit tests; EDA mode; hint ladder injection |
| `tests/test_meeting_summary.py` | Multi-speaker meeting integration with *Max, Ruby, Kyle, Walker, Parkman* |
| `tests/test_interview.py` | Interview boundary and validation: language, difficulty, count range |

### Frontend Tests

```bash
# From repo root (using make):
make test-frontend

# Or manually from frontend/:
cd frontend
npm run test -- --run --reporter=verbose
```

### TypeScript Typecheck & Production Build

```bash
make lint-frontend   # tsc --noEmit
make build           # vite build → frontend/dist/
```

### Utility Scripts

```bash
# Verify environment is correctly configured:
python scripts/verify_env.py

# Smoke-test all live API endpoints (requires running backend):
python scripts/test_api_endpoints.py

# Try a sample EDA workflow against real data:
python samples/scripts/sample_eda_workflow.py
```

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/health` | Server liveness check; reports model and configuration status |
| `GET`  | `/api/system/metrics` | Runtime diagnostics: uptime, Python version, memory usage |
| `POST` | `/api/generate/eda-code` | Generate Pandas EDA code from a dataset description |
| `POST` | `/api/generate/visualization-code` | Generate Matplotlib/Seaborn plotting code |
| `POST` | `/api/generate/resume` | Transform experience paragraph to structured resume |
| `POST` | `/api/generate/interview-questions` | Generate calibrated technical interview questions |
| `POST` | `/api/summarize/meeting` | Summarize multi-speaker meeting notes to executive brief |

Swagger UI (interactive): `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

---

## ⌨️ Keyboard Shortcuts

Navigate the application hands-free with these global shortcuts:

| Shortcut | Action |
|----------|--------|
| `Alt + 1` | Go to Dashboard |
| `Alt + 2` | Go to Data Analysis |
| `Alt + 3` | Go to Resume Generator |
| `Alt + 4` | Go to Interview Questions |
| `Alt + 5` | Go to Meeting Summarizer |
| `Alt + D` | Toggle Dark Mode |

---

## 🎨 UI/UX Highlights

- **Spline 3D Hero Scene** — Interactive WebGL 3D animation on the dashboard landing page
- **Dark Mode** — Full dark/light toggle with Tailwind CSS design tokens persisted to `localStorage`
- **Toast Notifications** — Lightweight non-blocking feedback for copy, export, and error events
- **React Error Boundary** — Graceful fallback UI prevents full-page crashes on component errors
- **Multi-Format Export Dropdown** — Export generated content as `.txt`, `.md`, `.py`, or PDF
- **Keyboard Shortcuts** — Alt+1–5 and Alt+D for power-user navigation without mouse clicks
- **Responsive Layout** — Sidebar collapses on mobile; all feature pages scroll cleanly on small screens

---

## 🔄 CI/CD

This repository includes GitHub Actions workflows that run automatically on every push and pull request to `main`:

| Workflow | Trigger | Matrix | What runs |
|----------|---------|--------|-----------|
| `backend-ci.yml` | `push`/`PR` to `main` (backend paths) | Python 3.10, 3.11, 3.12 | `pytest` full suite |
| `frontend-ci.yml` | `push`/`PR` to `main` (frontend paths) | Node 18, 20 | `tsc --noEmit` → `vitest` → `vite build` |

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
- Click **Summarize Meeting** to review the executive summary organized into:
  - **Executive Overview**
  - **Key Updates & Progress** (Max, Ruby)
  - **Blockers, Risks & Dependencies** (Kyle)
  - **Support Offered** (Walker)
  - **Decisions Recorded**
  - **Action Items & Next Steps** (with priority and owner tags)

---

## 📂 Sample Data

The `samples/` directory contains ready-to-use test data:

| File | Use with |
|------|----------|
| `samples/data/sales_performance.csv` | EDA Code Generator — describe the CSV columns |
| `samples/data/customer_churn.json` | EDA Code Generator — JSON dataset description |
| `samples/transcripts/standup_meeting.txt` | Meeting Summarizer — multi-speaker standup |
| `samples/resumes/raw_experience_fullstack.txt` | Resume Generator — full-stack engineer experience |
| `samples/scripts/sample_eda_workflow.py` | Local EDA template to run with pandas |

---

## 📄 License

This project is open-source under the **MIT License**.
