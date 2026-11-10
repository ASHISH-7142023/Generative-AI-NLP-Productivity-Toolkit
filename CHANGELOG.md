# Changelog

All notable changes to the **Generative AI NLP Productivity Toolkit** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-10

### Added
- **Career Tools**: Added ATS-aligned Cover Letter Generator (`POST /api/generate/cover-letter`) with tone calibration (professional, enthusiastic, executive, technical).
- **Frontend Command Palette**: Instant navigation via `Ctrl+K` / `Cmd+K` keyboard shortcut.
- **Generation History Drawer**: Local persistence in `localStorage` allowing users to view, copy, and re-export past generations.
- **Content Metrics**: Reading time calculator, word count, character count, and line badges on result panels.
- **Form Draft Persistence**: `useFormDraft` hook with debounced `sessionStorage` autosave.
- **System Theme Sync**: Dark/Light mode synchronization with OS `prefers-color-scheme`.
- **Token & Cost Calculator**: High-precision estimation of prompt/completion tokens and dollar cost across GPT model tiers.
- **Security & Guardrails**:
  - `InputSanitizer`: Redaction of prompt injection patterns and control character removal.
  - In-memory thread-safe LRU response cache with TTL expiration.
  - Domain exceptions with standard error JSON envelopes.
- **DevOps & Containers**:
  - Multi-stage production `Dockerfile` for FastAPI backend.
  - Multi-stage production Nginx `Dockerfile` for React frontend.
  - `docker-compose.yml` for unified one-command local stack execution.
  - GitHub Actions workflows for Docker build validation and CodeQL security analysis.
- **Testing & Benchmarking**:
  - Comprehensive unit test suites for sanitizer, cost calculator, cache, and cover letter generator.
  - Standalone latency and throughput benchmark tool (`scripts/benchmark_latency.py`).
  - Synthetic test dataset synthesizer (`scripts/generate_sample_data.py`).
- **Architecture Documentation**:
  - ADR 0001: Stateless FastAPI backend architecture.
  - ADR 0002: Client-side safety and zero-evaluation guarantee.
  - Comprehensive API Reference (`docs/API_REFERENCE.md`) and Environment Variables Guide (`docs/ENVIRONMENT_VARIABLES.md`).

---

## [1.0.0] - 2026-11-08

### Added
- **Core Workspace**: Decoupled full-stack architecture with FastAPI backend and React 18 + TypeScript frontend.
- **Module A (Data Analysis Assistant)**:
  - Natural language to Pandas exploratory data analysis (EDA) code generation.
  - Natural language to Matplotlib & Seaborn visualization code generation.
- **Module B (Resume Generator)**:
  - Factual STAR-formatted resume transformation from raw candidate experience paragraphs.
- **Module C (Interview Question Generator)**:
  - Technical programming question formulation calibrated by language, difficulty, and topic.
- **Module D (Meeting Notes Summarizer)**:
  - Multi-speaker transcript synthesis into executive briefs with action items and blocker extraction.
- **Responsible AI Safeguards**:
  - Strict zero-eval policy: generated Python scripts are rendered as text and never executed automatically on the server.
  - Zero client-side API key leakage: `OPENAI_API_KEY` remains strictly on the backend.
  - Strict anti-hallucination prompting rules enforcing factual fidelity.
- **UI/UX Design**:
  - Responsive layout with Tailwind CSS tokens and glassmorphism styling.
  - Dark mode toggle, keyboard navigation shortcuts (`Alt+1..5`), and toast notifications.
  - Spline 3D hero scene on the main dashboard.
