from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from models import User, MentorMentee_rel, Domains
from .auth import get_current_user
from starlette import status

router = APIRouter(
    prefix='/mentor',
    tags=['mentor']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get('/get-requests',status_code=status.HTTP_200_OK)
def get_mentee_requests(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")
    
    # Get pending mentee requests
    mentor_mentee_rel = db.query(MentorMentee_rel).filter(
        MentorMentee_rel.mentor_id == user.get('user_id'),
        MentorMentee_rel.approved.is_(False)
    ).all()
    
    mentee_list = []
    for rel in mentor_mentee_rel:
        # Get mentee details
        mentee = db.query(User).filter(User.id == rel.mentee_id).first()
        if mentee:
            # Get domain information
            domain = db.query(Domains).filter(Domains.id == rel.domain_id).first()
            domain_name = domain.name if domain else "Not specified"
            
            # Construct mentee request data
            mentee_data = {
                'mentee_id': mentee.id,
                'mentee_name': mentee.name,
                'domain': domain_name,
                'approved': False
            }
            mentee_list.append(mentee_data)
    
    response = {
        'status_code': status.HTTP_200_OK,
        'message': 'Success',
        'object': mentee_list
    }
    return response
