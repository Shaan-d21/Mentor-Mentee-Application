from fastapi import FastAPI
import models
from database import engine
from Routers import auth, user, mentee, mentor_approval,get_approved_mentees, get_approved_mentors, get_requests, api, mentee_roadmap, assign_roadmap, roadmap_route

app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentee.router)
app.include_router(mentor_approval.router)
app.include_router(get_approved_mentees.router)
app.include_router(get_approved_mentors.router)
app.include_router(get_requests.router)
app.include_router(api.router)
app.include_router(roadmap_route.router)
app.include_router(mentee_roadmap.router)
app.include_router(assign_roadmap.router)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

models.Base.metadata.create_all(bind = engine)