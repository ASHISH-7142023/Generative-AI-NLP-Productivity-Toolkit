# Architecture and Design Specification

## Generative AI-Powered NLP Application for Productivity Automation

**Project type:** Infosys Springboard Capstone\
**Repository:** `GenerativeAINLPProductivityToolkit`\
**Primary implementation language:** Python\
**Document purpose:** Implementation blueprint for Antigravity IDE / an
agentic coding assistant

------------------------------------------------------------------------

## 1. Project Overview

Build a user-friendly web application that uses an OpenAI language model
through the OpenAI API to support four productivity workflows:

1.  **EDA Code Generator:** Generate Python code for exploratory data
    analysis using Pandas.
2.  **Data Visualization Code Generator:** Generate Python code using
    Matplotlib and Seaborn.
3.  **Resume Generator:** Turn a user's paragraph about experience,
    skills, education, and projects into a structured resume.
4.  **Interview Question Generator:** Generate programming interview
    questions for a selected language and difficulty.
5.  **Meeting Notes Summarizer:** Convert raw meeting notes into a
    concise summary, key updates, blockers, and action items.

The EDA and visualization tasks are separate features, but can be
presented together under a single **Data Analysis Assistant** module.

### 1.1 Goals

-   Deliver all requirements in the capstone problem statement.
-   Provide a polished, responsive interface that is simple to
    demonstrate.
-   Keep API credentials on the server and never expose them in frontend
    code.
-   Make generated code readable and clearly label it as AI-generated.
-   Handle empty input, API errors, rate limits, and long inputs
    gracefully.
-   Keep the project easy to install, run, test, and explain during
    evaluation.

### 1.2 Out of Scope for the First Release

-   User accounts, paid subscriptions, and billing.
-   Automatic execution of generated Python code.
-   Uploading or storing sensitive resumes or meeting notes in a
    database.
-   Fine-tuning a model.
-   Integrations with calendars, email, ATS systems, or conferencing
    software.

------------------------------------------------------------------------

## 2. Model and API Requirements

The original assignment says to use GPT-3. GPT-3 is a legacy model
family, and the original model identifier may not be available to every
API account. Before implementation, verify the model names available for
the configured OpenAI account.

**Implementation rule:** Configure the model through an environment
variable, for example `OPENAI_MODEL`. Do not hard-code a legacy model
identifier throughout the codebase. Use the exact model requested by the
course only if it is available; otherwise use an API-supported model and
document the substitution in the README/report.

Use the official OpenAI Python SDK and the supported Responses API where
available. Keep all model calls in the backend. Do not imitate or expose
a private chain of thought; ask for concise results, structured
sections, and brief explanations only.

------------------------------------------------------------------------

## 3. Recommended Technology Stack

### Frontend

-   React with TypeScript and Vite.
-   Tailwind CSS for responsive styling.
-   A small icon library such as Lucide for interface icons.
-   Fetch API for requests to the backend.

### Backend

-   Python 3.11 or newer, subject to dependency compatibility.
-   FastAPI for REST endpoints and automatic API documentation.
-   Official OpenAI Python SDK.
-   Pydantic for request validation.
-   `python-dotenv` for local environment configuration.
-   Python `logging` for server-side diagnostics.

### Data and storage

-   No database required for the initial release.
-   Keep user inputs and outputs in client memory unless the user
    explicitly exports them.
-   Use browser download actions for user-requested exports.
-   Do not persist API keys or user content in logs.

### Testing and quality

-   Pytest and FastAPI TestClient for backend tests.
-   Vitest and React Testing Library for frontend tests if practical.
-   ESLint and TypeScript checks for the frontend.
-   Ruff or an equivalent Python linter for the backend.

### Dependency files

-   `backend/requirements.txt` or `backend/pyproject.toml`
-   `frontend/package.json`
-   `.env.example`
-   `.gitignore`

Use stable, compatible dependency versions and commit a lockfile where
the package manager supports one.

------------------------------------------------------------------------

## 4. High-Level Architecture

``` mermaid
flowchart TD
    U[User] --> UI[React + TypeScript Web UI]
    UI --> V[Client-side Validation]
    V --> API[FastAPI REST API]
    API --> SC[Input Validation and Limits]
    SC --> SVC[Application Service Layer]
    SVC --> PM[Prompt Builder by Feature]
    PM --> OA[OpenAI API]
    OA --> SVC
    SVC --> OUT[Output Normalization]
    OUT --> API
    API --> UI
    UI --> R[Result Viewer / Copy / Download]
```

### Architecture responsibilities

-   **Web UI:** Collect inputs, show loading and error states, and
    display generated results.
-   **Client validation:** Catch missing fields and obvious invalid
    values before submitting.
-   **FastAPI:** Validate requests, route requests to the correct
    service, and return consistent responses.
-   **Application services:** Coordinate each feature without mixing UI
    logic into model calls.
-   **Prompt builders:** Create task-specific instructions with explicit
    output requirements.
-   **OpenAI client:** Make external model requests using server-side
    credentials.
-   **Output normalization:** Remove accidental wrapping fences where
    appropriate, validate expected structure, and return a safe display
    format.
-   **Result viewer:** Show results as text or code, with copy and
    download options.

------------------------------------------------------------------------

## 5. Suggested Repository Structure

``` text
GenerativeAINLPProductivityToolkit/
├── README.md
├── ARCHITECTURE_AND_DESIGN.md
├── .gitignore
├── .env.example
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── logging_config.py
│   │   ├── api/
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── openai_service.py
│   │   │   ├── data_analysis_service.py
│   │   │   ├── resume_service.py
│   │   │   ├── interview_service.py
│   │   │   └── meeting_service.py
│   │   └── prompts/
│   │       ├── data_analysis.py
│   │       ├── resume.py
│   │       ├── interview.py
│   │       └── meeting.py
│   ├── tests/
│   │   ├── test_health.py
│   │   ├── test_validation.py
│   │   └── test_routes.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── api/
        │   └── client.ts
        ├── components/
        │   ├── AppHeader.tsx
        │   ├── Sidebar.tsx
        │   ├── FeatureCard.tsx
        │   ├── InputField.tsx
        │   ├── ResultPanel.tsx
        │   ├── CodeResult.tsx
        │   ├── LoadingState.tsx
        │   └── ErrorMessage.tsx
        ├── features/
        │   ├── data-analysis/
        │   │   └── DataAnalysisPage.tsx
        │   ├── resume/
        │   │   └── ResumeGeneratorPage.tsx
        │   ├── interview/
        │   │   └── InterviewGeneratorPage.tsx
        │   └── meeting/
        │       └── MeetingSummarizerPage.tsx
        └── types/
            └── api.ts
```

Antigravity may adjust this structure if a simpler organization is more
maintainable, but preserve the separation between frontend, API routes,
business services, prompts, and configuration.

------------------------------------------------------------------------

## 6. User Interface and Visual Design

### 6.1 Design direction

Create a modern, professional AI productivity workspace. Avoid a generic
unstyled form collection. Use a consistent layout, clear hierarchy,
generous spacing, and accessible contrast.

**Suggested visual tokens** - App background: `#F7F8FC` - Main surface:
`#FFFFFF` - Primary text: `#172033` - Secondary text: `#667085` -
Primary action: `#5B5FEF` - Primary hover: `#4549D8` - Border:
`#E5E7EB` - Success: `#15803D` - Warning: `#B45309` - Error: `#B91C1C` -
Border radius: 12--16 px for cards - Font: Inter or a system sans-serif
fallback

Use these tokens consistently and verify text contrast. The interface
must be responsive for desktop, tablet, and mobile.

### 6.2 Main application shell

-   **Header:** Product mark, title, small "AI Productivity Workspace"
    subtitle, and API/service status indicator that does not expose
    secrets.
-   **Navigation:** Sidebar or compact navigation for Data Analysis,
    Resume Generator, Interview Questions, and Meeting Summarizer.
-   **Workspace:** Feature title, short description, input form, primary
    generate button, and output panel.
-   **Footer:** Capstone project attribution and a brief AI-output
    disclaimer.

### 6.3 Dashboard

The landing view should include: - Heading: "Your AI Productivity
Workspace" - Short introduction explaining the four workflows. - Four
feature cards with a small icon, one-sentence explanation, and an "Open
tool" action. - A simple "How it works" section: Enter input → Generate
→ Review and export. - No fake usage statistics, fake testimonials, or
fabricated model status.

### 6.4 Shared interactions

-   Disable the Generate button when required fields are empty or while
    a request is in progress.
-   Show a spinner and an informative status message during generation.
-   Keep existing output visible until a new successful response
    arrives, or clearly indicate that new generation is in progress.
-   Show clear inline validation and API errors.
-   Add **Copy** and **Download** actions to result panels.
-   Display code in a monospace code block with a language label.
-   Make controls keyboard accessible and provide visible focus states.
-   Confirm before clearing a long user input if practical.

------------------------------------------------------------------------

## 7. Feature Requirements and Prompt Design

### 7.1 Module A --- EDA Code Generator

**Purpose:** Generate Python code for exploratory data analysis using
Pandas.

**Inputs** - Dataset description (required). - Optional CSV filename or
expected DataFrame name. - Optional analysis goals, such as
missing-value checks or outlier exploration.

**Prompt requirements** - Act as a Python data analyst. - Generate
runnable, commented Python code. - Include imports and show how to load
a CSV if a filename is provided. - Include `head()`, `shape`, `columns`,
`info()`, data types, missing-value counts, duplicate checks, and
`describe()` where appropriate. - Use safe, general patterns and avoid
assuming columns not described by the user. - If the dataset schema is
unknown, use generic inspection code instead of inventing column
names. - Return code only if the user requested code only.

**Output** - Generated Python code. - Language badge: Python. - Copy and
`.py` download actions. - Note that code should be reviewed and run
against the real dataset.

### 7.2 Module A2 --- Visualization Code Generator

**Purpose:** Generate plotting code using Matplotlib and Seaborn.

**Inputs** - Dataset description (required). - Optional column names and
visualization goal. - Optional DataFrame variable name, default `df`.

**Prompt requirements** - Include imports for Pandas, Matplotlib, and
Seaborn when needed. - Generate suitable plots based on the described
columns. - Include titles, axis labels, readable figure sizes, and
`plt.tight_layout()`. - Use numeric columns for correlation heatmaps and
guard against datasets with no numeric columns. - Avoid referencing
columns that were not supplied. If columns are unknown, include clearly
marked placeholders or generic examples. - Include `plt.show()`.

**Output** - Generated Python code. - Copy and `.py` download actions. -
Brief safety note: generated code is not executed automatically.

**Acceptance criteria** - User can request EDA and visualization code
independently. - The API returns a readable code string. - Missing
dataset descriptions are rejected with a helpful validation message.

### 7.3 Module B --- Resume Generator

**Purpose:** Turn a paragraph about a candidate's skills and experience
into a professional resume draft.

**Inputs** - Experience and skills paragraph (required). - Optional
target role. - Optional style: concise, standard, or detailed.

**Prompt requirements** - Use only facts supplied by the user. - Never
invent employers, qualifications, dates, metrics, awards, or
certifications. - Omit unknown details instead of fabricating them. -
Organize available information into relevant sections: - Professional
Summary - Technical Skills - Education - Experience / Internship -
Projects - Certifications - Use concise, action-oriented professional
wording. - Preserve the user's factual meaning. - If the user did not
provide information for a section, omit it or mark it as information to
add later; do not fill it with assumptions.

**Output** - Formatted resume text with clear headings. - Copy and
`.txt` download actions. - Optional print-friendly view for browser
"Save as PDF."

**Privacy** - Tell users not to enter government identifiers, passwords,
or other unnecessary sensitive personal data. - Do not persist resume
inputs on the server.

### 7.4 Module C --- Programming Interview Question Generator

**Purpose:** Generate interview questions for a selected programming
language.

**Inputs** - Programming language (required; e.g. Java, Python, C,
JavaScript). - Difficulty (Beginner, Intermediate, Advanced). - Number
of questions (integer from 1 to 30). - Optional topic (e.g. OOP, SQL,
data structures, algorithms).

**Prompt requirements** - Generate the requested number of distinct
questions. - Match the selected language, difficulty, and topic. - Mix
conceptual and coding questions where appropriate. - Avoid duplicates
and ambiguous wording. - Include concise answers, hints, or solution
outlines if requested. - Clearly separate questions from answers. - Do
not claim questions are guaranteed to appear in an actual interview.

**Output** - Numbered questions. - Optional expandable answer/hint
section if the user requested answers. - Copy and `.txt` download
actions.

### 7.5 Module D --- Meeting Notes Summarizer

**Purpose:** Summarize meeting notes while retaining important facts,
owners, and unresolved issues.

**Inputs** - Raw meeting notes (required). - Optional summary style:
concise, standard, or action-focused.

**Prompt requirements** - Summarize only what is present in the notes. -
Preserve names, numbers, dates, and status accurately. - Separate key
updates, blockers, support offered, decisions, and next steps. -
Identify action owners only where explicitly stated or unambiguously
implied. - Do not invent deadlines, decisions, commitments, or owners. -
If no action items or decisions are stated, say so rather than
fabricating them.

**Example input**

``` text
Max: Profits up 50%
Ruby: New servers are online
Kyle: Need more time to fix software
Walker: Happy to help
Parkman: Beta testing almost done
```

**Expected summary characteristics** - Profit increase reported: 50%
(Max). - Infrastructure update: new servers are online (Ruby). -
Blocker: Kyle needs more time to fix the software. - Support offered:
Walker is willing to help. - Testing update: beta testing is almost
complete (Parkman). - Next steps should be framed as suggestions unless
the notes explicitly assign them.

**Output** - Meeting overview. - Key updates. - Blockers and risks. -
Decisions, if present. - Action items and owners, if present. - Copy and
`.txt` download actions.

------------------------------------------------------------------------

## 8. API Design

Prefix all endpoints with `/api`.

### 8.1 Health endpoint

`GET /api/health`

Response:

``` json
{
  "status": "ok",
  "service": "nlp-productivity-toolkit"
}
```

Do not include API keys, environment contents, or other secrets in this
response.

### 8.2 EDA code endpoint

`POST /api/generate/eda`

Request:

``` json
{
  "dataset_description": "A student dataset containing marks and attendance",
  "filename": "students.csv"
}
```

Response:

``` json
{
  "success": true,
  "feature": "eda",
  "result": "Generated Python code goes here"
}
```

### 8.3 Visualization code endpoint

`POST /api/generate/visualization`

Request:

``` json
{
  "dataset_description": "A student dataset containing marks and attendance",
  "dataframe_name": "df"
}
```

Response:

``` json
{
  "success": true,
  "feature": "visualization",
  "result": "Generated Python code goes here"
}
```

### 8.4 Resume endpoint

`POST /api/generate/resume`

Request:

``` json
{
  "experience": "Describe skills, projects, education, and experience here",
  "target_role": "Python Developer",
  "style": "standard"
}
```

Response:

``` json
{
  "success": true,
  "feature": "resume",
  "result": "Generated resume goes here"
}
```

### 8.5 Interview question endpoint

`POST /api/generate/interview-questions`

Request:

``` json
{
  "language": "Java",
  "difficulty": "Intermediate",
  "count": 5,
  "topic": "Object-oriented programming"
}
```

Response:

``` json
{
  "success": true,
  "feature": "interview",
  "result": "Generated questions go here"
}
```

### 8.6 Meeting summary endpoint

`POST /api/summarize/meeting`

Request:

``` json
{
  "notes": "Max: Profits up 50%\nRuby: New servers are online",
  "style": "standard"
}
```

Response:

``` json
{
  "success": true,
  "feature": "meeting",
  "result": "Generated meeting summary goes here"
}
```

### 8.7 Error response format

Return a consistent structure:

``` json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a dataset description."
  }
}
```

Use suitable HTTP status codes: - `400` for malformed requests where
appropriate. - `422` for validation failures. - `429` for rate limiting
or upstream quota exhaustion where applicable. - `502` or `503` for
upstream model/API failures. - `500` only for unexpected server errors.

Do not send stack traces, raw provider payloads, or secrets to the
browser.

------------------------------------------------------------------------

## 9. Backend Design

### 9.1 Configuration

Create a typed settings module that reads environment variables: -
`OPENAI_API_KEY` --- required for generation. - `OPENAI_MODEL` ---
required/defaulted to a verified supported model identifier. -
`FRONTEND_ORIGIN` --- permitted frontend origin for CORS. -
`MAX_INPUT_CHARS` --- configurable maximum user input length. -
`REQUEST_TIMEOUT_SECONDS` --- external API timeout. - `APP_ENV` ---
development or production.

Provide `.env.example` with placeholder values only. Never commit
`.env`.

### 9.2 OpenAI service

Implement one reusable service responsible for: 1. Creating the OpenAI
client from server-side configuration. 2. Sending prompts to the
configured model. 3. Applying request timeouts and handling provider
errors. 4. Extracting the generated text. 5. Returning a simple string
or typed service result to feature services.

Keep the OpenAI SDK calls isolated so the model/API can be changed in
one place. Avoid logging complete prompts, resumes, or meeting notes by
default.

### 9.3 Prompt builder and feature services

Each feature should have its own prompt builder and service function.
Avoid constructing large prompts directly inside API route functions.

Use clear functions such as: - `build_eda_prompt(...)` -
`build_visualization_prompt(...)` - `build_resume_prompt(...)` -
`build_interview_prompt(...)` - `build_meeting_summary_prompt(...)`

### 9.4 Validation

Use Pydantic schemas to validate: - Required strings are not blank. -
Inputs are within configured length limits. - Interview count is between
1 and 30. - Difficulty and style values belong to an allowed set. -
Optional filenames and DataFrame names follow reasonable identifier
rules. - Unknown fields are handled consistently.

### 9.5 API documentation

Enable FastAPI's OpenAPI documentation in development. The evaluator
should be able to open `/docs` locally to inspect the endpoints. Disable
or protect interactive documentation in production if the deployment
requires it.

------------------------------------------------------------------------

## 10. Frontend-to-Backend Contract

Create a centralized frontend API client rather than duplicating `fetch`
logic in each page.

Responsibilities: - Read the backend base URL from a Vite environment
variable such as `VITE_API_BASE_URL`. - Send JSON requests to the
correct endpoint. - Parse successful responses. - Convert non-2xx
responses into readable error messages. - Handle network errors and
unexpected response formats. - Avoid printing user inputs or API
credentials to browser logs.

Each feature page should: 1. Maintain controlled form state. 2. Validate
required fields. 3. Submit the request to the API client. 4. Show
loading state. 5. Display the result or an actionable error. 6. Provide
copy/download actions.

The frontend environment variable must contain only the backend URL.
**Never place `OPENAI_API_KEY` in a `VITE_` variable**, because Vite
exposes such variables to browser-side code.

------------------------------------------------------------------------

## 11. Security, Privacy, and Responsible AI

-   Keep the OpenAI API key on the backend only.
-   Use environment variables or the deployment platform's secret
    manager.
-   Add `.env`, virtual environments, build outputs, and cache files to
    `.gitignore`.
-   Validate and limit request sizes to reduce abuse and excessive API
    cost.
-   Configure CORS to allow only the expected frontend origin in
    production.
-   Apply rate limiting appropriate to the deployment.
-   Do not execute generated Python code on the server.
-   Display generated code as text; never use `eval`, `exec`, shell
    execution, or dynamic code execution on model output.
-   Treat model output as untrusted content.
-   Render generated text safely; do not interpret arbitrary output as
    raw HTML.
-   Avoid logging personal resume information or full meeting
    transcripts.
-   Show a note that generated output may contain errors and should be
    reviewed.
-   Do not fabricate qualifications, achievements, meeting decisions, or
    action owners.
-   Return generic client errors while keeping useful, sanitized
    server-side diagnostics.
-   Do not claim that the app is secure or production-ready until
    relevant checks have actually been completed.

------------------------------------------------------------------------

## 12. Error and Loading States

The UI should explicitly support: - Empty required fields. - Invalid
interview question count. - Inputs that exceed the maximum length. -
Missing or invalid API key. - Unsupported model name. - API quota or
rate-limit errors. - Network timeout or unavailable backend. - Empty
model response. - Unexpected response structure. - Copy-to-clipboard
failure. - Download failure.

Error messages should explain what the user can do next. Never show a
blank result panel when a request fails.

------------------------------------------------------------------------

## 13. Testing Plan

### Backend tests

-   Health endpoint returns a valid response.
-   Blank inputs are rejected.
-   Input length limits are enforced.
-   Interview count boundaries are validated.
-   Invalid difficulty/style values are rejected.
-   Each route returns the expected response schema.
-   OpenAI calls are mocked during automated tests.
-   Provider errors become safe, consistent HTTP errors.
-   No test requires a real API key by default.

### Frontend tests

-   Dashboard renders all four feature cards.
-   Each feature page displays its required inputs.
-   Empty forms show validation messages.
-   Generate buttons show loading state.
-   Successful mocked responses render in the result panel.
-   Failed requests show a useful error message.
-   Copy and download actions are available.
-   Navigation and forms are keyboard accessible.

### Manual acceptance test

1.  Start backend and frontend.
2.  Open the application in a browser.
3.  Generate EDA code for a sample student dataset.
4.  Generate a Matplotlib/Seaborn visualization script.
5.  Generate a resume from a sample paragraph.
6.  Generate five Java interview questions.
7.  Summarize the example meeting notes from the assignment.
8.  Test invalid inputs and simulate an API failure.
9.  Confirm that no API key appears in browser source, network
    responses, or Git history.

------------------------------------------------------------------------

## 14. Local Development and Run Instructions

### Backend

From the repository root:

``` bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

Windows PowerShell:

``` powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:

``` bash
source .venv/bin/activate
```

Install dependencies and start the server:

``` bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend should be available at `http://localhost:8000`; API docs at
`http://localhost:8000/docs`.

### Frontend

In a separate terminal:

``` bash
cd frontend
npm install
npm run dev
```

Configure `VITE_API_BASE_URL=http://localhost:8000` in the frontend
environment file, if required by the implementation. Restart the Vite
server after changing environment variables.

Document exact prerequisites and commands in the final README.

------------------------------------------------------------------------

## 15. Implementation Phases for Antigravity

### Phase 1 --- Inspect and plan

-   Inspect the current repository before changing files.
-   Preserve any existing working implementation unless it conflicts
    with the requirements.
-   Create a short implementation checklist.
-   Confirm available runtime versions and dependency compatibility.

### Phase 2 --- Backend foundation

-   Create FastAPI app, configuration, schemas, health route, and shared
    OpenAI service.
-   Implement safe error handling and input limits.
-   Verify `/api/health` and `/docs`.

### Phase 3 --- Feature services

-   Implement prompt builders and services for all five operations: EDA,
    visualization, resume, interview questions, and meeting
    summarization.
-   Keep the model configurable.
-   Add mocked tests for each endpoint.

### Phase 4 --- Frontend foundation

-   Build the responsive application shell, navigation, dashboard,
    reusable form components, and result panels.
-   Apply consistent typography, spacing, colors, and accessible
    interaction states.

### Phase 5 --- Feature pages and integration

-   Implement each feature form.
-   Connect pages to the API client.
-   Add loading, validation, error, copy, and download behavior.
-   Verify the request and response contracts end to end.

### Phase 6 --- Quality assurance

-   Run backend tests, frontend tests, linting, and build checks.
-   Test all five operations using sample inputs.
-   Verify responsive layouts and keyboard navigation.
-   Check that generated code is displayed only and never executed.
-   Check for exposed secrets and unsafe logging.

### Phase 7 --- Documentation and handoff

-   Create or update `README.md` with project overview, screenshots if
    available, stack, setup, environment variables, usage, limitations,
    and troubleshooting.
-   Keep this `ARCHITECTURE_AND_DESIGN.md` aligned with the delivered
    implementation.
-   Report implemented features, files changed, commands run, tests
    passed, and known limitations.
-   Do not claim a test passed unless it was actually run.

------------------------------------------------------------------------

## 16. Definition of Done

The project is ready for capstone demonstration when:

-   [ ] The dashboard links to all four user-facing modules.
-   [ ] EDA code generation uses Pandas-oriented prompts.
-   [ ] Visualization code generation uses Matplotlib and
    Seaborn-oriented prompts.
-   [ ] Resume generation uses only user-provided facts.
-   [ ] Interview questions respect the chosen language, difficulty, and
    count.
-   [ ] Meeting summaries preserve the important facts and do not invent
    commitments.
-   [ ] The OpenAI API key is kept on the backend.
-   [ ] The selected model is configurable and verified for the API
    account.
-   [ ] Inputs are validated and errors are handled gracefully.
-   [ ] Results can be copied and downloaded.
-   [ ] Generated code is never executed automatically.
-   [ ] Automated tests and build checks pass, or any failures are
    explicitly documented.
-   [ ] README setup instructions work on a clean checkout.
-   [ ] The app works at desktop and mobile sizes.

------------------------------------------------------------------------

## 17. Final Instructions to Antigravity

Implement the application described in this document in the current
repository. Start by inspecting the repository and its existing files;
do not blindly overwrite working code. Prefer a complete, maintainable,
end-to-end implementation over decorative mockups.

Use real API integration through the backend, not hard-coded demo
responses. If no API key is configured, show a clear setup message and
allow automated tests to run using mocked API calls. Do not claim that
generation works without verifying the configured API path.

Follow the module requirements, endpoint contracts, security rules,
visual design, and acceptance criteria in this document. Run the
available tests and build commands, resolve errors where feasible, and
finish with a concise implementation report listing the delivered
features, setup commands, tests actually run, and any remaining
limitations.
