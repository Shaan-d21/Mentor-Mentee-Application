from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill
from .auth import get_current_user
from passlib.context import CryptContext

router = APIRouter(
    prefix='/users',
    tags=['users']
)

bcrypt_context = CryptContext(schemes=['bcrypt'],deprecated = 'auto')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class CreateUserRequest(BaseModel):
    name : str
    mail : str
    pwd : str
    role : str

class CreateAdminRequest(BaseModel):
    name : str
    mail : str
    pwd : str


@router.post('/register/admin', status_code=200)
async def create_admin(new_admin : CreateAdminRequest, db : db_dependency):
    user_model = User(
        name = new_admin.name,
        mail = new_admin.mail,
        pwd = bcrypt_context.hash(new_admin.pwd),
        role = "admin"
    )
    db.add(user_model)
    db.commit()
    return {"Message": "Admin Created"}





@router.post('/register/User', status_code=200)
async def create_user( db : db_dependency, new_user : CreateUserRequest):
    # if user is None or user.get('role')!='admin':
        # return HTTPException(status_code=401, detail="Authentication Error")
    user_model = User(
        name = new_user.name,
        mail = new_user.mail,
        pwd = bcrypt_context.hash(new_user.pwd),
        role = new_user.role
    )
    db.add(user_model)
    db.commit()
    return {"Message": "User Created"}



@router.get('/all_users')
async def view_all_mentors(db: db_dependency):
    users = db.query(User).all()
    if users == []:
        raise HTTPException(status_code=404, detail="Users not found...")
    return users

    
# @router.delete('/delete_mentee/{mentee_id}')
# async def del_mentee(db : db_dependency, mentee_id : int = Path(gt=0)):
#     mentor = db.query(User_Mentee).filter(User_Mentee.mentee_id == mentee_id).first()
#     if mentor is None:
#         return HTTPException(status_code=404, detail='Mentor not Found')
#     db.query(User_Mentee).filter(User_Mentee.mentee_id == mentee_id).delete()
#     db.commit()
#     return {"Message": "Mentee Deleted"}

class Mentor_Profile(BaseModel):
    name : str
    mail : str
    exp : int
    github_id : str
    contact : str
    gender : str

@router.put("/mentor/profile", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentor_pro : Mentor_Profile):
    if user is None or user.get('role') != 'mentor':
        return HTTPException(status_code=401, detail="Authentication Error")
    mentor_updates = db.query(User).filter(User.id == user.get('user_id')).first()
    if mentor_updates is None:
        raise  HTTPException(status_code=404, detail='Mentor not found')
    mentor_updates.id = mentor_updates.id
    mentor_updates.name = mentor_pro.name
    mentor_updates.mail = mentor_pro.mail
    # mentor_updates.pwd = mentor_updates.pwd
    mentor_updates.role = mentor_updates.role
    # mentor_updates.pwd = mentor_updates.organization_id
    mentor_updates.exp = mentor_pro.exp
    mentor_updates.github_id = mentor_pro.github_id
    # mentor_updates.profile_pic_url = mentor_updates.profile_pic_url
    mentor_updates.contact = mentor_pro.contact
    mentor_updates.gender = mentor_pro.gender
    db.add(mentor_updates)
    db.commit()
    return {"Success" : "Mentor profile updated"}

class Skillset(BaseModel):
    skill_name : str
    proficiency : int = Field(gt=0, lt=6)

class SkillAdd(BaseModel):
    skills : List[Skillset]


# @router.post('mentor/skils')
# async def update(user : user_dependency, db : db_dependency, skills_list: SkillAdd):
#     if user is None or user.get('role') != 'mentor':
#         return HTTPException(status_code=401, detail="Authentication Error")
#     skills_list = skills_list.skills
#     # print(skills_list[0])
#     for skill in skills_list:
#     #     skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
#     #     if skill_model is None:
#     #         skill_model = Skill(
#     #             name = skill.skillname
#     #         )
#     #         db.add(skill_model)
#     #         db.commit()
        

