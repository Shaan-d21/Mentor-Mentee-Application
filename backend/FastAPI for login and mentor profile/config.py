# config.py - Configuration settings for the application

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# AI Model Configuration
GEMINI_MODEL_NAME = 'models/gemini-1.5-flash-8b-exp-0827'

# Database Configuration for PostgreSQL
DATABASE_USER = os.getenv("POSTGRES_USER")
DATABASE_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DATABASE_HOST = os.getenv("POSTGRES_HOST")
DATABASE_PORT = os.getenv("POSTGRES_PORT")
DATABASE_NAME = os.getenv("POSTGRES_DB")

# Construct the PostgreSQL connection string
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"