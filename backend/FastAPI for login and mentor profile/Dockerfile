# Stage 1: Dependencies
FROM python:3.12-slim AS base

WORKDIR /app

COPY requirements.txt ./
RUN apt-get update && apt-get install -y gcc g++ libpq-dev && \
    python -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install torch sentence-transformers && \
    rm -rf /root/.cache/pip

# Stage 2: Application
FROM python:3.12-slim

WORKDIR /app

COPY --from=base /app/venv /app/venv
COPY . .

ENV PATH="/app/venv/bin:$PATH"

EXPOSE 8000

# Apply migrations before starting the server (Replace alembic command if you're using something else)
CMD ["/bin/sh", "-c", "/app/venv/bin/alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]
