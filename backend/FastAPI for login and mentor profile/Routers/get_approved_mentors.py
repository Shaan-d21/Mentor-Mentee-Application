from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from models import User, MentorMentee, Domain
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
        select(User, MentorMentee, Domain)
        .join(MentorMentee, MentorMentee.mentor_id == User.id)
        .join(Domain, MentorMentee.domain_id == Domain.id)
        .where(
            and_(
                MentorMentee.mentee_id == user.get('user_id'),
                MentorMentee.status == 'approved'
            )
        )
    )

    result = db.execute(query).fetchall()

    mentor_list = []
    for row in result:
        user_obj = row[0]
        mentor_mentee_obj = row[1]
        domain_obj = row[2]

        mentor_data = {
            "id": user_obj.id,
            "name": user_obj.name,
            "mail": user_obj.mail,
            "contact": user_obj.contact,
            "designation": user_obj.designation,
            "exp": user_obj.exp,
            "profile_pic_url": user_obj.profile_pic_url,
            "role": user_obj.role.value if hasattr(user_obj.role, 'value') else str(user_obj.role),
            "is_profile_complete": user_obj.is_profile_complete,
            "created_at": user_obj.created_at,
            "updated_at": user_obj.updated_at,
            "domain_id": mentor_mentee_obj.domain_id,
            "domain_name": domain_obj.name if domain_obj else None
        }

        mentor_list.append(mentor_data)

    response = {
        'status_code': status.HTTP_200_OK,
        'message': 'Success',
        'object': mentor_list
    }
    return response
