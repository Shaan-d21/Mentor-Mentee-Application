# ------------ Stage 1: Builder ------------
FROM python:3.12-slim AS builder

# Set environment variables
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        g++ \
        libpq-dev \
        libterm-readline-perl-perl \
        curl \
        && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python -m venv $VIRTUAL_ENV

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirement file and install base dependencies
COPY requirements.txt .

# Install from requirements.txt with timeout & retry options
RUN pip install --default-timeout=120 --retries=10 -r requirements.txt

# Install additional heavy packages separately to reduce retry risk
RUN pip install --default-timeout=120 --retries=10 \
    torch \
    sentence-transformers \
    alembic \
    uvicorn

# Clean pip cache to reduce image size
RUN rm -rf /root/.cache/pip

# ------------ Stage 2: Runtime ------------
FROM python:3.12-slim

# Set environment variables
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy virtual environment from builder stage
COPY --from=builder /app/venv /app/venv

# Copy application code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
