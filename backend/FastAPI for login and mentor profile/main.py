from fastapi import FastAPI
import models
from database import engine
from Routers import auth, user, mentor_approval,mentee


app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentor_approval.router)
app.include_router(mentee.router)


models.base.metadata.create_all(bind = engine)