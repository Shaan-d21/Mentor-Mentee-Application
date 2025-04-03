# Stage 1: Build Dependencies
FROM python:3.12-slim AS build

WORKDIR /app

# Copy only requirements first for better caching
COPY requirements.txt .

# Create virtual environment and install dependencies
RUN python -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Stage 2: Application Image
FROM python:3.12-slim 

WORKDIR /app

# Copy virtual environment from build stage
COPY --from=build /app/venv /app/venv

# Copy application code
COPY . .

# Set environment variable for virtual environment
ENV PATH="/app/venv/bin:$PATH"

# Expose the application port
EXPOSE 8000

# Use exec form of CMD to properly handle signals
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
