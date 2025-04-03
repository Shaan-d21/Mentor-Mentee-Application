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
    exp : int
    github_id : str
    contact : str
    gender : str

@router.put("/mentee/profile_creation", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentee_pro : Mentee_Profile):  
    try: 
        if user is None or user.get('role') != 'mentee':
            return HTTPException(status_code=401, detail="Authentication Error")
        mentee_updates = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentee_updates is None:
            raise  HTTPException(status_code=404, detail='Mentee not found')
        # mentor_updates.id = mentor_updates.id
        mentee_updates.name = mentee_pro.name
        # mentor_updates.mail = mentor_pro.mail
        # mentor_updates.pwd = mentor_updates.pwd
        # mentor_updates.role = mentor_updates.role
        # mentor_updates.pwd = mentor_updates.organization_id
        mentee_updates.exp = mentee_pro.exp
        mentee_updates.github_id = mentee_pro.github_id
        # mentor_updates.profile_pic_url = mentor_updates.profile_pic_url
        mentee_updates.contact = mentee_pro.contact
        mentee_updates.gender = mentee_pro.gender
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
        'exp' : mentee_updates.exp,
        'github_id' : mentee_updates.github_id,
        'contact' : mentee_updates.contact,
        'gender' : mentee_updates.gender,
        'Skill set' : skills_model
    }
    return profile_details
