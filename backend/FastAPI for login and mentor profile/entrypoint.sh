#!/bin/bash

# Wait for postgres to be ready
echo "Waiting for postgres..."
sleep 10

# Generate migrations
echo "Generating migrations..."
alembic revision --autogenerate -m "Update db"

# Apply migrations
echo "Applying migrations..."
alembic upgrade head

# Start the FastAPI application
echo "Starting FastAPI application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000