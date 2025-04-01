from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.sql import select, and_
from models import User, MentorMentee_rel, MenteeSkill, Skill
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


@router.get('/get-approved-mentee',status_code=status.HTTP_200_OK)
def get_approved_mentee(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized Access")
    
    # Get approved mentees
    mentor_mentee_rel = db.query(MentorMentee_rel).filter(
        MentorMentee_rel.mentor_id == user.get('user_id'),
        MentorMentee_rel.approved.is_(True)
    ).all()
    
    mentee_list = []
    for rel in mentor_mentee_rel:
        # Get mentee details
        mentee = db.query(User).filter(User.id == rel.mentee_id).first()
        if mentee:
            # Get mentee skills
            mentee_skills = []
            skill_records = db.query(MenteeSkill).filter(MenteeSkill.mentee_id == mentee.id).all()
            for skill_record in skill_records:
                skill = db.query(Skill).filter(Skill.id == skill_record.skill_id).first()
                if skill:
                    mentee_skills.append(skill.name)
            
            # Construct mentee data
            mentee_data = {
                'mentee_id': mentee.id,
                'mentee_name': mentee.name,
                'email': mentee.mail,
                'contact': mentee.contact or '',
                'github_id': mentee.github_id or '',
                'experience': str(mentee.exp) + ' years' if mentee.exp else 'Not specified',
                'skills': mentee_skills,
                'domain_id': rel.domain_id
            }
            mentee_list.append(mentee_data)
    
    response = {
        'status_code': status.HTTP_200_OK,
        'message': 'Success',
        'object': mentee_list
    }
    return response
