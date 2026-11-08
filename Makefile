# ============================================================
#  Generative AI NLP Productivity Toolkit — Developer Makefile
#  Usage: make <target>
# ============================================================

.PHONY: help install install-backend install-frontend \
        dev dev-backend dev-frontend \
        test test-backend test-frontend \
        lint lint-backend lint-frontend \
        build clean

PYTHON      := python
UV          := uv
NPM         := npm
BACKEND_DIR := backend
FRONTEND_DIR:= frontend

# ── Default target ──────────────────────────────────────────
help:
	@echo ""
	@echo "  Generative AI NLP Productivity Toolkit"
	@echo "  ════════════════════════════════════════"
	@echo "  make install          Install all dependencies (backend + frontend)"
	@echo "  make dev-backend      Start FastAPI dev server  (port 8000)"
	@echo "  make dev-frontend     Start Vite dev server     (port 5173)"
	@echo "  make test-backend     Run pytest (backend)"
	@echo "  make test-frontend    Run Vitest (frontend)"
	@echo "  make lint             Lint backend (flake8) + frontend (tsc)"
	@echo "  make build            Production build (frontend)"
	@echo "  make clean            Remove build artefacts and caches"
	@echo ""

# ── Install ─────────────────────────────────────────────────
install: install-backend install-frontend

install-backend:
	@echo "▶ Installing backend dependencies with uv..."
	cd $(BACKEND_DIR) && $(UV) sync

install-frontend:
	@echo "▶ Installing frontend dependencies with npm..."
	cd $(FRONTEND_DIR) && $(NPM) ci

# ── Dev servers ─────────────────────────────────────────────
dev-backend:
	@echo "▶ Starting FastAPI backend on http://localhost:8000 ..."
	cd $(BACKEND_DIR) && $(UV) run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	@echo "▶ Starting Vite frontend on http://localhost:5173 ..."
	cd $(FRONTEND_DIR) && $(NPM) run dev

# ── Tests ───────────────────────────────────────────────────
test: test-backend test-frontend

test-backend:
	@echo "▶ Running backend tests with pytest..."
	cd $(BACKEND_DIR) && $(UV) run python -m pytest tests/ -v --tb=short

test-frontend:
	@echo "▶ Running frontend tests with Vitest..."
	cd $(FRONTEND_DIR) && $(NPM) run test -- --run --reporter=verbose

# ── Lint ────────────────────────────────────────────────────
lint: lint-backend lint-frontend

lint-backend:
	@echo "▶ Linting backend with flake8..."
	cd $(BACKEND_DIR) && $(UV) run flake8 app/ tests/ --max-line-length=100

lint-frontend:
	@echo "▶ Type-checking frontend with tsc..."
	cd $(FRONTEND_DIR) && npx tsc --noEmit

# ── Build ───────────────────────────────────────────────────
build:
	@echo "▶ Building frontend production bundle..."
	cd $(FRONTEND_DIR) && $(NPM) run build

# ── Clean ───────────────────────────────────────────────────
clean:
	@echo "▶ Removing build artefacts..."
	rm -rf $(FRONTEND_DIR)/dist
	rm -rf $(BACKEND_DIR)/__pycache__
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	@echo "✓ Clean complete"
