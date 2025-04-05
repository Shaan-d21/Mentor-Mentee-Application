from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from models import User, MentorMentee
from .auth import get_current_user
from starlette import status

router = APIRouter(
    prefix='/mentee',
    tags=['mentee']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/get-approved-mentors', status_code=status.HTTP_200_OK)
def get_approved_mentors(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentee':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")
    
    query = (
        select(User)
        .join(MentorMentee, MentorMentee.mentor_id == User.id)
        .where(and_(MentorMentee.mentee_id == user.get('user_id'), MentorMentee.status == 'approved'))
    )
    result = db.execute(query).fetchall()

    mentor_list = [dict(row._mapping) for row in result]

    response = {
        'status_code': status.HTTP_200_OK,
        'message': 'Success',
        'object': mentor_list
    }
    return response
