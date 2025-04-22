from enum import Enum
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorMentee, Domain, MenteeSkill
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

class ProficiencyLevel(Enum):
    beginner = 1
    intermediate = 2
    advanced = 3

class Skillset(BaseModel):
    skill_name : str
    proficiency : ProficiencyLevel

class SkillAdd(BaseModel):
    skills : List[Skillset]

@router.post('/mentee/skills')
async def update_skills(user : user_dependency, db : db_dependency, skills_list: SkillAdd): # user : user_dependency
    try:
        if user is None or user.get('role') != 'mentee':
            return HTTPException(status_code=401, detail="Authentication Error")
        
        skills_list = skills_list.skills
        # print(skills_list[0])
        for skill in skills_list:
            skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            if skill_model is None:
                skill_model = Skill(
                    name = skill.skill_name
                )
                db.add(skill_model)
                db.commit()
            skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            proficiency_enum = ProficiencyLevel(skill.proficiency)

            mentee_skill = db.query(MenteeSkill).filter(
                MenteeSkill.mentee_id == user.get('user_id'),
                MenteeSkill.skill_id == skill_model.id
            ).first()

            if mentee_skill:
                mentee_skill.proficiency = proficiency_enum.name
            else:
                mentee_skill = MenteeSkill(
                    mentee_id=user.get('user_id'),
                    skill_id=skill_model.id,
                    proficiency=proficiency_enum.name
                )
                db.add(mentee_skill)

            db.commit()
    except :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='error')
    else :
        return {"Message" : "Mentee skills updated",'status_code': 200}
       
        
@router.get('/mentee/profile',status_code=status.HTTP_200_OK)
def mentee_profile(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentee':
        return HTTPException(status_code=401, detail="Authentication Error")
    mentee = db.query(User).filter(User.id == user.get('user_id')).first()
    if mentee is None:
        raise HTTPException(status_code=404, detail="Mentor not found")

    domain_name = mentee.domain.name if mentee.domain else None

    skill_data = db.query(MenteeSkill).filter(MenteeSkill.mentee_id == mentee.id).all()
    skills = [{"name": s.skill.name, "proficiency": s.proficiency} for s in skill_data]

    profile_data = {
        "name": mentee.name,
        "mail": mentee.mail,
        "role": mentee.role,
        "exp": mentee.exp,
        "designation": mentee.designation,
        "contact": mentee.contact,
        "domain": domain_name,  
        "Skill set": skills
    }
    return profile_data


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

class Cancel_Request(BaseModel):
    mentor_id : int

@router.delete('/cancel_request')
async def cancel_request(user: user_dependency, db : db_dependency, req: Cancel_Request):
    if user is None or user.get('role')!='mentee':
        raise HTTPException(status_code=401, detail='User not Authorised')
    request_model = db.query(MentorMentee).filter(MentorMentee.mentee_id == user.get('user_id'), MentorMentee.mentor_id == req.mentor_id).first()
    if request_model is None:
        raise HTTPException(status_code=404, detail='Request not found')
    
    if request_model.status.value != 'pending':
        raise HTTPException(status_code=400, detail='Request is already accepted or rejected')
    db.query(MentorMentee).filter(MentorMentee.mentee_id == user.get('user_id'), MentorMentee.mentor_id == req.mentor_id).delete()
    db.commit()
    return {'status_code': 200, 'Message': 'Request Deleted'}


@router.get('/Requests', status_code=200)
async def show_sent_requests(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentee':
        raise HTTPException(status_code=401, detail='User not Authorised')

    requests = (
        db.query(
            MentorMentee.status,
            MentorMentee.comment,
            User.name.label("mentor_name"),
            User.mail.label("mentor_mail"),
            User.id.label('mentor_id'),
            User.designation.label("mentor_designation"),
            Domain.name.label("domain_name")
        )
        .join(User, User.id == MentorMentee.mentor_id)
        .join(Domain, Domain.id == MentorMentee.domain_id)
        .filter(MentorMentee.mentee_id == user.get('user_id'))
        .all()
    )

    result = [
        {
            "mentor_name": r.mentor_name,
            'mentor_id': r.mentor_id,
            "mentor_mail": r.mentor_mail,
            "mentor_designation": r.mentor_designation,
            "domain_name": r.domain_name,
            "status": r.status,
            "comment": r.comment
        }
        for r in requests
    ]

    return result