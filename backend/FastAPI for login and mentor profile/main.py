from fastapi import FastAPI
import models
from database import engine
from Routers import auth, user, mentee, mentor_approval,get_approved_mentees,get_requests


app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentee.router)
app.include_router(mentor_approval.router)
app.include_router(get_approved_mentees.router)
app.include_router(get_requests.router)


models.base.metadata.create_all(bind = engine)