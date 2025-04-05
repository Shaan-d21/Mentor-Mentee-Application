from fastapi import FastAPI
import models
from database import engine
from Routers import auth, user, mentee, mentor_approval,get_approved_mentees,get_requests, api
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-deployed-frontend-url.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentee.router)
app.include_router(mentor_approval.router)
app.include_router(get_approved_mentees.router)
app.include_router(get_requests.router)
app.include_router(api.router)

models.Base.metadata.create_all(bind = engine)