# Stage 1: Dependencies
FROM python:3.12-slim AS base

WORKDIR /app

COPY requirements.txt ./

RUN apt-get update && apt-get install -y gcc g++ libpq-dev && \
    python -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r requirements.txt && \
    # /app/venv/bin/pip install torch sentence-transformers alembic uvicorn && \
    rm -rf /root/.cache/pip

# Verify all necessary tools are installed
RUN /app/venv/bin/pip show uvicorn && \
    /app/venv/bin/pip show alembic && \
    /app/venv/bin/uvicorn --version

# Stage 2: Application
FROM python:3.12-slim

WORKDIR /app

COPY --from=base /app/venv /app/venv
COPY . .

ENV PATH="/app/venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
