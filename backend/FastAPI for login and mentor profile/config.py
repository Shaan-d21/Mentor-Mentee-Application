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
DATABASE_USER = os.getenv("DB_USER")
DATABASE_PASSWORD = os.getenv("DB_PASSWORD")
DATABASE_HOST = os.getenv("DB_HOST")
DATABASE_PORT = os.getenv("DB_PORT")
DATABASE_NAME = os.getenv("DB_NAME")

# Construct the PostgreSQL connection string
DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"