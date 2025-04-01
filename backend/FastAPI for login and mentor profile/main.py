from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from Routers import auth, user, mentee, mentor_approval, get_approved_mentees, get_requests, profile_completion, mentee_dashboard, get_mentors, get_domains

# Initialize FastAPI application
app = FastAPI(
    title="Mentor-Mentee Application API",
    description="API for managing mentor-mentee relationships and course management",
    version="1.0.0"
)

# Configure CORS middleware for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
    max_age=3600,  # Cache preflight requests for 1 hour
)

# API version prefix following REST API best practices
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# Root endpoint with welcome message
@app.get("/")
async def read_root():
    return {
        "message": "Welcome to the Mentor-Mentee Application API!",
        "version": API_VERSION,
        "documentation": "/docs"  # Swagger UI documentation endpoint
    }

# Include routers with version prefix
# Auth routes for user authentication
app.include_router(auth.router, prefix=API_PREFIX)
# User management routes
app.include_router(user.router, prefix=API_PREFIX)
# Mentee specific routes
app.include_router(mentee.router, prefix=API_PREFIX)
# Mentor approval and request management routes
app.include_router(mentor_approval.router, prefix=API_PREFIX)
app.include_router(get_approved_mentees.router, prefix=API_PREFIX)
app.include_router(get_requests.router, prefix=API_PREFIX)
# Profile completion routes
app.include_router(profile_completion.router, prefix=API_PREFIX)
# Mentee dashboard routes
app.include_router(mentee_dashboard.router, prefix=API_PREFIX)
# Get all mentors
app.include_router(get_mentors.router, prefix=API_PREFIX)
# Get all domains
app.include_router(get_domains.router, prefix=API_PREFIX)

# Create database tables
models.base.metadata.create_all(bind=engine)