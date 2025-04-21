from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import  Topic, Feedback
from .auth import get_current_user
from starlette import status

router = APIRouter(
    prefix='/progress',
    tags=['progress']
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class Request(BaseModel):
    topic_id : int

#To mark a Topic as done by mentee
@router.put('/mark_done')
async def mark_done(user: user_dependency, db: db_dependency, req: Request):
    if user is None or user.get('role') != 'mentee':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if topic_model is None:
        raise HTTPException(status_code = 404, detail = 'Topic not Found')
    if topic_model.status.value == 'completed':
        raise HTTPException(status_code = 400, detail = 'Topics is already completed')
    if topic_model.status.value == 'marked':
        raise HTTPException(status_code = 400, detail = 'Topics is already Marked')
    topic_model.status = 'marked'
    db.add(topic_model)
    db.commit()
    return { 'status_code': 200, 'Message': 'Topic Marked'}

class Feedback_request(BaseModel):
    topic_id : int
    feedback: str
    mentee_id : int

#To mark a Topic as Complete/Closed by mentor
@router.put('/mark_complete')
async def mark_complete(user: user_dependency, db: db_dependency, req: Feedback_request):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code = 401, detail= 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if topic_model is None:
        raise HTTPException(status_code = 404, detail = 'Topic not Found')
    # print(topic_model.status.value )
    if topic_model.status.value != 'marked':
        raise HTTPException(status_code = 400, detail = 'Topics is not marked as complete by mentee')
    topic_model.status = 'completed'
    feedback_model = Feedback(
        sender_id = user.get('user_id'),
        receiver_id = req.mentee_id,
        feedback = req.feedback,
        sender_role = 'mentor',
        topic_id = req.topic_id
    )
    db.add(topic_model)
    db.add(feedback_model)
    db.commit()
    return { 'status_code': 200, 'Message': 'Topic Completed'}


@router.put('/reassign_topic')
async def reassign_topic(user: user_dependency, db: db_dependency, req: Feedback_request):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if topic_model is None:
        raise HTTPException(status_code = 404, detail = 'Topic not Found')
    if topic_model.status.value == 'completed':
        raise HTTPException(status_code = 400, detail = 'Topics is already completed')
    if topic_model.status.value != 'marked':
        raise HTTPException(status_code = 400, detail = 'Topics is not marked as complete by mentee')
    feedback_model = Feedback(
        sender_id = user.get('user_id'),
        receiver_id = req.mentee_id,
        feedback = req.feedback,
        sender_role = 'mentor',
        topic_id = req.topic_id
    )
    db.add(feedback_model)
    topic_model.status = 'reassigned'
    db.add(topic_model)
    db.commit()
    return { 'status_code': 200, 'Message': 'Topic Reassigned'}


