from fastapi import FastAPI
import models
from database import engine
from Routers import auth, get_approved_mentees, user

app = FastAPI()
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(get_approved_mentees.router)

models.base.metadata.create_all(bind = engine)