# Environment Variables Reference Guide

This document lists all configuration variables recognized by the FastAPI backend, their default values, and operational guidelines.

---

## Backend Configuration Table

| Variable | Type | Default | Required? | Description |
|---|---|---|:---:|---|
| `OPENAI_API_KEY` | `string` | `""` | **Yes (for generation)** | OpenAI secret key (`sk-...`). When omitted, server boots in preview mode; endpoints return 503 setup alerts. |
| `OPENAI_MODEL` | `string` | `gpt-4o-mini` | No | Primary OpenAI model used for text and code generation. |
| `OPENAI_FALLBACK_MODEL` | `string` | `gpt-3.5-turbo` | No | Secondary fallback model invoked automatically if primary model hits capacity or rate limits. |
| `OPENAI_MAX_RETRIES` | `integer` | `3` | No | Number of exponential backoff retry attempts before returning an error. |
| `FRONTEND_ORIGIN` | `string` | `http://localhost:5173` | No | Comma-separated list of allowed CORS origins. |
| `MAX_INPUT_CHARS` | `integer` | `10000` | No | Maximum allowed input length for text fields to guard against payload flooding. |
| `REQUEST_TIMEOUT_SECONDS` | `float` | `30.0` | No | Maximum time in seconds to wait for an upstream OpenAI API response. |
| `APP_NAME` | `string` | `NLP Productivity Toolkit` | No | Application display title used in logs and OpenAPI docs. |
| `APP_VERSION` | `string` | `1.0.0` | No | Semantic version string returned by `/api/health`. |
| `APP_ENV` | `string` | `development` | No | Deployment environment: `development`, `staging`, or `production`. Swagger docs disabled in production. |
| `LOG_FORMAT` | `string` | `text` | No | Server log output format: `text` (human-readable) or `json` (cloud log routers). |

---

## Frontend Configuration Table

| Variable | Type | Default | Required? | Description |
|---|---|---|:---:|---|
| `VITE_API_BASE_URL` | `string` | `http://localhost:8000` | No | Base URL of the backend FastAPI service accessed by browser fetch calls. |

---

## Local Development `.env` Example

Create `backend/.env` with the following contents:

```env
OPENAI_API_KEY=sk-proj-yourActualKeyHere
OPENAI_MODEL=gpt-4o-mini
OPENAI_FALLBACK_MODEL=gpt-3.5-turbo
OPENAI_MAX_RETRIES=3
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:3000
MAX_INPUT_CHARS=10000
REQUEST_TIMEOUT_SECONDS=30.0
APP_ENV=development
LOG_FORMAT=text
```

> **Security Note:** Never commit `.env` files to git. The `.gitignore` file is configured to exclude all `.env*` files automatically.
