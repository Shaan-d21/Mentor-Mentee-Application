from operator import or_
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from database import SessionLocal
from models import User, MentorMentee, Domain, Roadmap, Topic
from .auth import get_current_user
from pydantic import BaseModel

router = APIRouter(
    prefix='/mentee',
    tags=['roadmap']
) 

class RoadmapRequest(BaseModel):
    mentor_id: int
    domain_id: int

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# Endpoint 1: Get Approved Mentors with Domain Details
@router.get('/mentor-roadmap-details', status_code=status.HTTP_200_OK)
def get_approved_mentors_details(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentee':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")

    query = (
        select(
            MentorMentee.mentor_id,
            MentorMentee.domain_id,
            MentorMentee.roadmap_id,
            User.name.label("mentor_name"),
            Domain.name.label("domain_name")
        )
        .select_from(MentorMentee)
        .join(User, User.id == MentorMentee.mentor_id)
        .join(Domain, Domain.id == MentorMentee.domain_id)
        .where(and_(
            MentorMentee.mentee_id == user.get('user_id'),
            MentorMentee.status == 'approved'
        ))
    )

    mentor_domain_pairs = db.execute(query).fetchall()

    result = []
    for row in mentor_domain_pairs:
        result.append({
            "mentor_id": row.mentor_id,
            "mentor_name": row.mentor_name,
            "domain_id": row.domain_id,
            "domain_name": row.domain_name,
            "roadmap_id": row.roadmap_id
        })

    return {
        "status_code": status.HTTP_200_OK,
        "message": "Success",
        "object": result
    }


# Endpoint 2: Get Roadmap Topic List by Roadmap id
@router.get('/roadmap-topics/{roadmap_id}', status_code=status.HTTP_200_OK)
def get_roadmap_topics(
    roadmap_id: int,
    user: user_dependency,
    db: db_dependency
):
    if user is None or (user.get('role') != 'mentee' and user.get('role') != 'mentor'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")

    query = (
        select( 
            MentorMentee.roadmap_id
        )
        .where(and_(
            MentorMentee.roadmap_id == roadmap_id,
            or_(
            MentorMentee.mentee_id == user.get('user_id'),
            MentorMentee.mentor_id == user.get('user_id')
            )
        ))
    )

    mentee_roadmap = db.execute(query).first()

    if mentee_roadmap is None:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail='Roadmap not found or is not assigned')
    
    topics = db.query(Topic).filter(Topic.roadmap_id == mentee_roadmap[0]).all()

    if not topics:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No topics found for the given roadmap id")
    
    
    roadmap_list = {}
    for topic in topics:
        topic_status = topic.status
        topic_id = topic.id
        name = topic.name
        if topic_status not in roadmap_list:
            roadmap_list[topic_status] = []
        roadmap_list[topic_status].append({'topic_id':topic_id, 'topic_name':name})
        
    return {
        "status_code": status.HTTP_200_OK,
        "message": "success",
        "object": roadmap_list
    }
