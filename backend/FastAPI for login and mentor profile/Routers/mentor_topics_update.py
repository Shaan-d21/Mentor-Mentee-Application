from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill, MentorMentee, Domain, MenteeSkill, Topic, TopicStatus
from .auth import get_current_user
from starlette import status

router = APIRouter(
    prefix='/roadmap',
    tags=['roadmap']
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class Add_topic(BaseModel):
    topic_name : str
    roadmap_id : int
    description : str
    subtopics : list[str]
    reasoning : str

class Modify_topic(BaseModel):
    topic_id : int
    topic_name : str
    description : str
    subtopics : list[str]
    reasoning : str

class Remove_topic(BaseModel):
    topic_id : int

@router.post('/add_topic')
async def add_topic(new_topic: Add_topic, db :  db_dependency, user : user_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    subtopic = ''
    for i in new_topic.subtopics:
        subtopic += i+ ','
    subtopic = subtopic[:-1]
    topic_model = Topic(
        name = new_topic.topic_name,
        roadmap_id = new_topic.roadmap_id,
        description = new_topic.description,
        subtopics = subtopic,
        reasoning = new_topic.reasoning,
        status = 'assigned'
    )
    db.add(topic_model)
    db.commit()
    return {'status_code' : 200, 'Message': 'Topic Added successfully'}


@router.put('/modify_topic')
async def modify_topic(new_topic: Modify_topic, db :  db_dependency, user : user_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == new_topic.topic_id).first()
    if topic_model is None:
        raise HTTPException(status_code = 404, detail = 'Topic not found')
    subtopic = ''
    for i in new_topic.subtopics:
        subtopic += i+ ','
    subtopic = subtopic[:-1]
    topic_model.name = new_topic.topic_name
    topic_model.description = new_topic.description
    topic_model.subtopics = subtopic
    topic_model.reasoning = new_topic.reasoning
    db.add(topic_model)
    db.commit()
    return {'status_code' : 200, 'Message': 'Topic Modified successfully'}


@router.delete('/delete_topic')
async def delete_topic(topic: Remove_topic, db :  db_dependency, user : user_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    topic_model = db.query(Topic).filter(Topic.id == topic.topic_id).first()
    if topic_model is None:
        raise HTTPException(status_code = 404, detail = 'Topic not found')
    db.query(Topic).filter(Topic.id == topic.topic_id).delete()
    db.commit()
    return {'status_code' : 200, 'Message': 'Topic Removed successfully'}