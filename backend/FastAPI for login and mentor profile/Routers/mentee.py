from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill, MentorMentee, Domain, MenteeSkill
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


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class Mentee_Profile(BaseModel):
    name : str
    designation : str
    contact : str


@router.put("/mentee/profile_creation", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentee_pro : Mentee_Profile):  
    try: 
        if user is None or user.get('role') != 'mentee':
            return HTTPException(status_code=401, detail="Authentication Error")
        
        mentee_updates = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentee_updates is None:
            raise HTTPException(status_code=404, detail='Mentee not found')
        
        # Debug info
        print(f"Updating mentee profile: {mentee_pro.name}, {mentee_pro.contact}")
        
        mentee_updates.name = mentee_pro.name   
        mentee_updates.designation = mentee_pro.designation
        mentee_updates.contact = mentee_pro.contact
        mentee_updates.is_profile_complete = True
        db.add(mentee_updates)
        db.commit()
        
        return {"Message": "Mentee profile updated", 'status_code': 200}
    except Exception as e:
        print(f"Error in profile_creation: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Error: {str(e)}')

class Skillset(BaseModel):
    skill_name : str

class SkillAdd(BaseModel):
    skills : List[Skillset]

@router.post('/mentee/skills')
async def update_skills(user : user_dependency, db : db_dependency, skills_list: SkillAdd): # user : user_dependency
    try:
        if user is None or user.get('role') != 'mentee':
            return HTTPException(status_code=401, detail="Authentication Error")
        
        print(f"Updating mentee skills: {[skill.skill_name for skill in skills_list.skills]}")
        
        # First clear existing skills to prevent duplicates
        existing_skills = db.query(MenteeSkill).filter(MenteeSkill.mentee_id == user.get('user_id')).all()
        for skill in existing_skills:
            db.delete(skill)
        db.commit()
        
        # Add the new skills
        skills_list = skills_list.skills
        for skill in skills_list:
            skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            if skill_model is None:
                skill_model = Skill(
                    name = skill.skill_name
                )
                db.add(skill_model)
                db.commit()
            
            skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            skill_assign = MenteeSkill(
                mentee_id = user.get('user_id'),
                skill_id = skill_model.id
            )
            db.add(skill_assign)
            db.commit()
        
        return {"Message": "Mentee skills updated", 'status_code': 200}
    except Exception as e:
        print(f"Error in update_skills: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Error: {str(e)}')
        
@router.get('/mentee/profile',status_code=status.HTTP_200_OK)
def mentee_profile(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentee':
        return HTTPException(status_code=401, detail="Authentication Error")
    mentee_updates = db.query(User).filter(User.id == user.get('user_id')).first()
    skill_id_model = db.query(MenteeSkill).filter(MenteeSkill.mentee_id == user.get('user_id')).all()
    skills_model = []
    for i in skill_id_model:
        sk = {
            'name': i.skill.name
        }
        skills_model.append(sk)
    profile_details = {
        'name' : mentee_updates.name,
        'mail' : mentee_updates.mail,
        'role' : mentee_updates.role,
        'contact' : mentee_updates.contact,
        'designation' : mentee_updates.designation,
        'Skill set' : skills_model
    }
    return profile_details


class Req_model(BaseModel):
    domain: str
    mentor_id : int

@router.post('/mentorship')
async def request_mentorship(user: user_dependency, db : db_dependency, req: Req_model):
    if user is None or user.get('role')!='mentee':
        raise HTTPException(status_code=401, detail='User not Authorised')
    domain_model = db.query(Domain).filter(Domain.name == req.domain).first()
    if domain_model is None:
        domain_model = Domain(
            name = req.domain
        )
        db.add(domain_model)
        db.commit()
    domain_model = db.query(Domain).filter(Domain.name == req.domain).first()

        
    rel_model = MentorMentee(
        mentor_id = req.mentor_id,
        mentee_id = user.get('user_id'),
        domain_id = domain_model.id,
        status = 'pending'
    )
    db.add(rel_model)
    db.commit()
    return { 'status_code': 200, "Message":'Request Sent'}

@router.get('/Requests')
async def show_sent_requests(user: user_dependency, db : db_dependency):
    if user is None or user.get('role')!='mentee':
        raise HTTPException(status_code=401, detail='User not Authorised')
    req_model = db.query(MentorMentee).filter(MentorMentee.mentee_id == user.get('user_id')).all()
    return req_model