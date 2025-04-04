from fastapi import FastAPI
import models
from database import engine
from Routers import auth, user, mentee, mentor_approval,get_approved_mentees,get_requests, api
from Routers.roadmap_route import router as roadmap_router
from config import GOOGLE_API_KEY, GEMINI_MODEL_NAME

app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentee.router)
app.include_router(mentor_approval.router)
app.include_router(get_approved_mentees.router)
app.include_router(get_requests.router)
app.include_router(api.router)
app.include_router(roadmap_router)

models.Base.metadata.create_all(bind = engine)