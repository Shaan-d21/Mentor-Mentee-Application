from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User, Domain, Feedback, MentorMentee,Topic
from .auth import get_current_user
from starlette import status

router = APIRouter(
    prefix='/feedbacks',
    tags=['feedbacks']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/view')
async def view_all_feedbacks(user: user_dependency, db: db_dependency):
    if user is None or user.get('role')!='mentee':
        raise HTTPException(status_code = 401, detail = 'User Unauthorised')
    feedback_list = []
    feedback_model = db.query(Feedback).filter(Feedback.receiver_id == user.get('user_id')).all()
    for feedback in feedback_model:
        mentee_id = feedback.receiver_id
        mentor_id = feedback.sender_id
        rel_model = db.query(MentorMentee).filter(MentorMentee.mentee_id == mentee_id, MentorMentee.mentor_id == mentor_id).first()
        domain_id = rel_model.domain_id
        mentor_model = db.query(User).filter(User.id == mentor_id).first()
        mentor_name = mentor_model.name
        domain_model = db.query(Domain).filter(Domain.id == domain_id).first()
        domain_name = domain_model.name
        topic_model = db.query(Topic).filter(Topic.id == feedback.topic_id).first()
        object = {
            'feedback_id': feedback.id,
            "mentee_id" : mentee_id,
            "mentor_id" : mentor_id,
            "domain_id" : domain_id,
            "feedback" : feedback.feedback,
            "mentor_name" : mentor_name,
            "domain_name" : domain_name,
            'topic_id': topic_model.id,
            'topic_name' : topic_model.name
        }   
        feedback_list.append(object)
    return { 'status_code':200, 'Message': 'Success', 'Feedback List':   feedback_list }
