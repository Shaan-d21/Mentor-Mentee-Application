from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.responses import JSONResponse
import models
from database import engine

from Routers import auth, user, mentee, mentor_approval,get_approved_mentees, get_approved_mentors, get_requests, \
    predict, mentee_roadmap, assign_roadmap, roadmap_route, mentor_topics_update, progress_tracking

from fastapi.middleware.cors import CORSMiddleware
from starlette import status


app = FastAPI()

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://mm-fe.shaandewang.publicvm.com/", "http://localhost:8081", "http://181.214.44.15:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(mentee.router)
app.include_router(mentor_approval.router)
app.include_router(get_approved_mentees.router)
app.include_router(get_approved_mentors.router)
app.include_router(get_requests.router)
app.include_router(predict.router)
app.include_router(roadmap_route.router)
app.include_router(mentee_roadmap.router)
app.include_router(assign_roadmap.router)
app.include_router(mentor_topics_update.router)
app.include_router(progress_tracking.router)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.exception_handler(Exception)
async def global_exception_handler(req: Request, e: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": str(e),
            "type": type(e).__name__,
            "url": str(req.url),
            "method": req.method
        },
    )


models.Base.metadata.create_all(bind = engine)