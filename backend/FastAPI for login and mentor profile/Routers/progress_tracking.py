from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill, MentorMentee, Domain, MenteeSkill, Topic, TopicStatus
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
        raise HTTPException(tatus_code = 401, details = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if topic_model is None:
        raise HTTPException(tatus_code = 404, details = 'Topic not Found')
    if topic_model.status == 'completed':
        raise HTTPException(tatus_code = 400, details = 'Topics is already completed')
    if topic_model.status == 'marked':
        raise HTTPException(tatus_code = 400, details = 'Topics is already Marked')
    topic_model.status = 'marked'
    db.add(topic_model)
    db.commit()
    return { 'status_code': 200, 'Message': 'Topic Marked'}

#To mark a Topic as Complete/Closed by mentor
@router.put('/mark_complete')
async def mark_complete(user: user_dependency, db: db_dependency, req: Request):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(tatus_code = 401, details = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if topic_model is None:
        raise HTTPException(tatus_code = 404, details = 'Topic not Found')
    if topic_model.status != 'marked':
        raise HTTPException(tatus_code = 400, details = 'Topics is not marked as complete by mentee')
    topic_model.status = 'completed'
    db.add(topic_model)
    db.commit()
    return { 'status_code': 200, 'Message': 'Topic Completed'}

