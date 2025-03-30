from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
# load_dotenv()

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:root123@db:5432/ProjectTest1'

# Add connection pooling and timeout parameters
try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Verify connection before using from pool
        pool_recycle=3600,   # Recycle connections after 1 hour
        connect_args={
            "connect_timeout": 5,  # 5 seconds connection timeout
        }
    )
    print("Database engine created successfully")
except Exception as e:
    print(f"Error creating database engine: {str(e)}")
    # If database connection fails, we'll still define the engine but with logging
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        echo=True  # Log all SQL statements for debugging
    )

# Session factory with auto-flush and auto-commit settings
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Base class for all database models
base = declarative_base()