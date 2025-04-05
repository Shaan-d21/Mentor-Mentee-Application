# config.py - Configuration settings for the application

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env only if not running inside Docker
if not os.environ.get("DOCKER_ENV", False):
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# AI Model Configuration
GEMINI_MODEL_NAME = 'models/gemini-1.5-flash-8b-exp-0827'

# PostgreSQL Configuration
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_HOST = os.getenv("POSTGRES_HOST", "localhost")
DATABASE_PORT = os.getenv("POSTGRES_PORT", 5432)
DATABASE_NAME = os.getenv("POSTGRES_DB")

# Construct the PostgreSQL connection string
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
