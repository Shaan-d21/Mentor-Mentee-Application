from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, MentorMentee, Roadmap
from .auth import get_current_user
from pydantic import BaseModel

router = APIRouter(
    prefix='/mentor',
    tags=['roadmap']
)

class AssignRoadmapRequest(BaseModel):
    mentee_id: int
    domain_id: int
    roadmap_id: int

# Dependencies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# Endpoint: Assign Roadmap to Mentee
@router.post('/assign-roadmap', status_code=status.HTTP_200_OK)
def assign_roadmap_to_mentee(
    body: AssignRoadmapRequest,
    user: user_dependency,
    db: db_dependency
):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")

    mentee_id = body.mentee_id
    domain_id = body.domain_id
    roadmap_id = body.roadmap_id

    if not mentee_id or not domain_id or not roadmap_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="mentee_id, domain_id, and roadmap_id are required")

    # Find the mentor-mentee-domain mapping
    record = db.query(MentorMentee).filter_by(
        mentor_id=user.get("user_id"),
        mentee_id=mentee_id,
        domain_id=domain_id
    ).first()

    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching mentor-mentee-domain relationship found")

    # Assign the roadmap
    record.roadmap_id = roadmap_id
    db.commit()

    return {
        "status_code": status.HTTP_200_OK,
        "message": "Roadmap assigned successfully"
    }
