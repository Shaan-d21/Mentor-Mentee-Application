from enum import Enum
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Header, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill, Domain
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
    domain_name: str

@router.put("/mentor/profile_creation", status_code=200)
async def mentor_profile_completion(user: user_dependency, db: db_dependency, mentor_pro: Mentor_Profile):
    try:
        if user is None or user.get('role') != 'mentor':
            raise HTTPException(status_code=401, detail="Authentication Error")
        
        mentor = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentor is None:
            raise HTTPException(status_code=404, detail="Mentor not found")

        # Look up domain_id using domain_name
        domain = db.query(Domain).filter(Domain.name == mentor_pro.domain_name).first()
        if not domain:
            raise HTTPException(status_code=400, detail="Invalid domain name")

        # Update mentor profile
        mentor.name = mentor_pro.name
        mentor.designation = mentor_pro.designation
        mentor.exp = mentor_pro.exp
        mentor.contact = mentor_pro.contact
        mentor.domain_id = domain.id
        mentor.is_profile_complete = True

        db.add(mentor)
        db.commit()

        return {"Message": "Mentor profile updated", "status_code": 200}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error while updating profile")

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
    try:
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

            mentor_skill = db.query(MentorSkill).filter(
                MentorSkill.mentor_id == user.get('user_id'),
                MentorSkill.skill_id == skill_model.id
            ).first()

            if mentor_skill:
                mentor_skill.proficiency = proficiency_enum.name
            else:
                mentor_skill = MentorSkill(
                    mentor_id=user.get('user_id'),
                    skill_id=skill_model.id,
                    proficiency=proficiency_enum.name
                )
                db.add(mentor_skill)

            db.commit()
    except :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='error')
    else :
        return {"Message" : "Mentor skills updated",'status_code': 200}
        
@router.get("/mentor/profile", status_code=status.HTTP_200_OK)
def mentor_profile(user: user_dependency, db: db_dependency):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(status_code=401, detail="Authentication Error")

    mentor = db.query(User).filter(User.id == user.get('user_id')).first()
    if mentor is None:
        raise HTTPException(status_code=404, detail="Mentor not found")

    domain_name = mentor.domain.name if mentor.domain else None

    skill_data = db.query(MentorSkill).filter(MentorSkill.mentor_id == mentor.id).all()
    skills = [{"name": s.skill.name, "proficiency": s.proficiency} for s in skill_data]

    profile_data = {
        "name": mentor.name,
        "mail": mentor.mail,
        "role": mentor.role,
        "exp": mentor.exp,
        "designation": mentor.designation,
        "contact": mentor.contact,
        "domain": domain_name,  
        "Skill set": skills
    }

    return profile_data