# API Reference Documentation

All endpoints return JSON responses. Successful generations return `success: true` and an optional `usage` object with token and cost estimations.

Base URL: `http://localhost:8000`

---

## 1. System Endpoints

### `GET /api/health`
Checks server liveness and OpenAI configuration status.

**Response:**
```json
{
  "status": "ok",
  "service": "nlp-productivity-toolkit",
  "version": "1.0.0",
  "model_configured": "gpt-4o-mini",
  "openai_key_configured": true,
  "environment": "development",
  "cache_status": "operational"
}
```

### `GET /api/system/metrics`
Diagnostics reporting server uptime, Python version, and active route count.

---

## 2. Generation Endpoints

### `POST /api/generate/eda`
Generate Pandas Python code for exploratory data analysis.

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate/eda \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_description": "Columns: customer_id, tenure_months, monthly_charges, churn (0 or 1)",
    "filename": "customer_churn.csv",
    "eda_mode": "comprehensive"
  }'
```

---

### `POST /api/generate/visualization`
Generate Matplotlib and Seaborn visualization code.

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate/visualization \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_description": "Sales data across 4 regions with monthly revenue",
    "dataframe_name": "df_sales",
    "columns": "region, monthly_revenue, quarter",
    "visualization_goal": "Compare regional sales performance using boxplots and bar charts"
  }'
```

---

### `POST /api/generate/resume`
Transform raw experience paragraphs into a structured Markdown resume.

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate/resume \
  -H "Content-Type: application/json" \
  -d '{
    "experience": "Software Engineer with 4 years building backend microservices in Python and FastAPI. Led payment pipeline optimization cutting latency by 35%. Mentored 3 engineers.",
    "target_role": "Staff Backend Engineer",
    "style": "standard"
  }'
```

---

### `POST /api/generate/cover-letter`
Synthesize an ATS-aligned cover letter matching candidate experience to a target job.

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate/cover-letter \
  -H "Content-Type: application/json" \
  -d '{
    "experience_text": "5 years building cloud APIs with FastAPI, Docker, and PostgreSQL.",
    "job_description": "Seeking Senior Engineer to lead backend architecture and AI tooling.",
    "company_name": "ScaleTech",
    "tone": "enthusiastic"
  }'
```

---

### `POST /api/generate/interview-questions`
Generate calibrated technical programming interview questions with hint ladders.

**Request:**
```bash
curl -X POST http://localhost:8000/api/generate/interview-questions \
  -H "Content-Type: application/json" \
  -d '{
    "language": "Python",
    "difficulty": "Intermediate",
    "count": 3,
    "topic": "Generators & Memory Efficiency",
    "include_answers": true
  }'
```

---

### `POST /api/summarize/meeting`
Summarize multi-speaker conversation transcripts into structured updates and action items.

**Request:**
```bash
curl -X POST http://localhost:8000/api/summarize/meeting \
  -H "Content-Type: application/json" \
  -d '{
    "meeting_notes": "Max: Profits up 50%\nRuby: New servers are online\nKyle: Need more time to fix software\nWalker: Happy to help\nParkman: Beta testing almost done",
    "style": "standard"
  }'
```

**Response:**
```json
{
  "success": true,
  "feature": "meeting",
  "result": "# Executive Meeting Summary\n\n## Key Updates\n- Max: Profits up 50%...",
  "usage": {
    "estimated_tokens": 320,
    "prompt_tokens": 95,
    "completion_tokens": 225,
    "estimated_cost_usd": 0.000149,
    "character_count": 890,
    "cached": false
  }
}
```
