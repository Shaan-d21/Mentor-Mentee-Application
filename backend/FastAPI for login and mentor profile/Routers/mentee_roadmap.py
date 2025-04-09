from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from database import SessionLocal
from models import User, MentorMentee, Domain, Roadmap
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
        })

    return {
        "status_code": status.HTTP_200_OK,
        "message": "Success",
        "object": result
    }

# Endpoint 2: Get Roadmap Name by Mentor ID and Domain ID
@router.post('/roadmap-topics', status_code=status.HTTP_200_OK)
def get_roadmap_name(
    body: RoadmapRequest,
    user: user_dependency,
    db: db_dependency
):
    if user is None or user.get('role') != 'mentee':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")

    mentor_id = body.mentor_id
    domain_id = body.domain_id

    if not mentor_id or not domain_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="mentor_id and domain_id are required")

    record = db.query(MentorMentee).filter_by(
        mentor_id=mentor_id,
        domain_id=domain_id,
        mentee_id=user.get('user_id')
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching mentor-domain mapping found")

    roadmap = db.query(Roadmap).filter_by(id=record.roadmap_id).first()

    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")

    return {
        "status_code": status.HTTP_200_OK,
        "message": "Success",
        "roadmap_name": roadmap.name
    }
