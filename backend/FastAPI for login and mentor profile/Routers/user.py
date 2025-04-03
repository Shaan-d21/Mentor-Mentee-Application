from enum import Enum
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Header, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill
from .auth import get_current_user
from jose import jwt, JWTError
from passlib.context import CryptContext
from starlette import status

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
    return {"Message": "Admin Created", 'status_code': 200}





@router.post('/register/User', status_code=200)
async def create_user( db : db_dependency, new_user : CreateUserRequest): #user: user_dependency,
    # if user is None or user.get('role')!='admin':
        # return HTTPException(status_code=401, detail="Authentication Error")
    user_model = User(
        name = new_user.name,
        mail = new_user.mail,
        pwd = bcrypt_context.hash(new_user.pwd),
        role = new_user.role,
        is_profile_complete = False
    )
    db.add(user_model)
    db.commit()
    return {"Message": "User Created", 'status_code': 200}


SECRET_KEY = 'f7458ea66f73cac978f1233a9c9622dd8795bc98a59b2bd26622b58872212385'
ALGORITHM = 'HS256'
# def secure(token):
#     # if we want to sign/encrypt the JSON object: {"hello": "world"}, we can do it as follows
#     # encoded = jwt.encode({"hello": "world"}, JWT_SECRET, algorithm=JWT_ALGORITHM)
#     decoded_token = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
#     # this is often used on the client side to encode the user's email address or other properties
#     return decoded_token



@router.get('/all_users')
async def view_all_users(db: db_dependency):
    # try:
    #     decoded = secure(authorization)
    # except:
    #     return HTTPException(status_code=404, detail='Not found')
    # else:
        users = db.query(User).all()
        if users == []:
            raise HTTPException(status_code=404, detail="Users not found...")
        return users

    
@router.delete('/delete_user/{id}')
async def del_user(user: user_dependency, db : db_dependency, id : int = Path(gt=0)):
    if user is None or user.get('role') != 'admin':
        return HTTPException(status_code=401, detail="Authentication Error")
    mentor = db.query(User).filter(User.id == id).first()
    if mentor is None:
        return HTTPException(status_code=404, detail='Mentor not Found')
    db.query(User).filter(User.id == id).delete()
    db.commit()
    return {"Message": "Mentee Deleted", 'status_code': 200}

class Mentor_Profile(BaseModel):
    name : str
    designation : str
    exp : int
    contact : str

@router.put("/mentor/profile_creation", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentor_pro : Mentor_Profile):  
    try: 
        if user is None or user.get('role') != 'mentor':
            return HTTPException(status_code=401, detail="Authentication Error")
        mentor_updates = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentor_updates is None:
            raise  HTTPException(status_code=404, detail='Mentor not found')
        mentor_updates.name = mentor_pro.name
        mentor_updates.designation = mentor_pro.designation
        mentor_updates.exp = mentor_pro.exp
        mentor_updates.contact = mentor_pro.contact
        mentor_updates.is_profile_complete = True
        db.add(mentor_updates)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Error')
    else:
        return {"Message" : "Mentor profile updated", 'status_code': 200}

class ProficiencyLevel(Enum):
    beginner = 1
    intermediate = 2
    advanced = 3

class Skillset(BaseModel):
    skill_name : str
    proficiency : ProficiencyLevel

class SkillAdd(BaseModel):
    skills : List[Skillset]


@router.post('/mentor/skills')
async def update_skills(user : user_dependency, db : db_dependency, skills_list: SkillAdd): # user : user_dependency
    # try:
        if user is None or user.get('role') != 'mentor':
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
            print(skill.proficiency)
            print(proficiency_enum.value)
            skill_assign = MentorSkill(
                mentor_id = user.get('user_id'),
                skill_id = skill_model.id,
                proficiency = proficiency_enum.name
            )
            db.add(skill_assign)
            db.commit()
    # except :
        # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='error')
    # else :
    #     return {"Message" : "Mentor skills updated",'status_code': 200}
        
@router.get('/mentor/profile',status_code=status.HTTP_200_OK)
def mentor_profile(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentor':
        return HTTPException(status_code=401, detail="Authentication Error")
    mentor_updates = db.query(User).filter(User.id == user.get('user_id')).first()
    skill_id_model = db.query(MentorSkill).filter(MentorSkill.mentor_id == user.get('user_id')).all()
    skills_model = []
    for i in skill_id_model:
        sk = {
            'name': i.skill.name,
            'proficiency' : i.proficiency
        }
        skills_model.append(sk)
    profile_details = {
        'name' : mentor_updates.name,
        'mail' : mentor_updates.mail,
        'role' : mentor_updates.role,
        'exp' : mentor_updates.exp,
        'designation' : mentor_updates.designation,
        'contact' : mentor_updates.contact,
        'Skill set' : skills_model
    }
    return profile_details
