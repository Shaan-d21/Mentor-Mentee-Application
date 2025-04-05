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
    contact : str


@router.put("/mentee/profile_creation", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentee_pro : Mentee_Profile):  
    try: 
        if user is None or user.get('role') != 'mentee':
            return HTTPException(status_code=401, detail="Authentication Error")
        mentee_updates = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentee_updates is None:
            raise  HTTPException(status_code=404, detail='Mentee not found')
        mentee_updates.name = mentee_pro.name
        mentee_updates.contact = mentee_pro.contact
        mentee_updates.is_profile_complete = True
        db.add(mentee_updates)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Error')
    else:
        return {"Message" : "Mentee profile updated", 'status_code': 200}

class Skillset(BaseModel):
    skill_name : str

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
            skill_assign = MenteeSkill(
                mentee_id = user.get('user_id'),
                skill_id = skill_model.id
            )
            db.add(skill_assign)
            db.commit()
    except :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='error')
    else :
        return {"Message" : "Mentor skills updated",'status_code': 200}
        
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
            "mentor_mail": r.mentor_mail,
            "mentor_designation": r.mentor_designation,
            "domain_name": r.domain_name,
            "status": r.status,
            "comment": r.comment
        }
        for r in requests
    ]

    return result