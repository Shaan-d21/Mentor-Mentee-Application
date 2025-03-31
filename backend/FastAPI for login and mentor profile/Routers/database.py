from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:happy36@localhost/ProjectTest1'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit = False)

base = declarative_base()