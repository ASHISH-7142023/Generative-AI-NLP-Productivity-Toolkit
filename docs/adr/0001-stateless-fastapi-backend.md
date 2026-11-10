# ADR 0001: Stateless FastAPI Backend Architecture

## Status
Accepted

## Context
The Generative AI NLP Productivity Toolkit orchestrates LLM interactions across four primary functional domains:
1. Exploratory Data Analysis & Visualization Scripting
2. STAR-formatted Resume & Cover Letter Generation
3. Multi-language Programming Interview Question Formulation
4. Multi-speaker Meeting Notes Summarization

We needed a backend framework capable of high-throughput asynchronous I/O, strict request validation, low overhead, and automatic OpenAPI documentation.

## Decision
We chose **FastAPI** with Python 3.12, utilizing:
- **Pydantic v2** for declarative schema definition and request validation.
- **Asynchronous endpoints (`async def`)** to prevent blocking worker threads during LLM HTTP calls.
- **Stateless service design** with all user session state retained either client-side or computed on-the-fly.
- **Custom middleware stack** for Request-ID correlation, process timing, and security headers.

## Consequences

### Positive
- High I/O concurrency when managing long-running OpenAI completion requests.
- Automatic interactive documentation via Swagger UI (`/docs`) and ReDoc (`/redoc`).
- Strong type safety across data boundaries using Pydantic models.
- Ease of unit testing using `pytest` and Starlette's `TestClient` / `AsyncClient`.

### Negative
- Python runtime memory footprint is marginally higher than Go or Rust implementations.
- Requires careful handling of CPU-bound operations in separate process pools if heavy parsing is introduced.

## Alternatives Considered
- **Flask**: Simpler setup, but lacking native async support and automatic OpenAPI generation without third-party extensions.
- **Django**: Excessive ORM and session overhead for an entirely stateless AI proxy toolkit.
- **Node.js / Express**: Strong async support, but Python is the industry-standard language for data science, Pandas, and prompt tooling.
