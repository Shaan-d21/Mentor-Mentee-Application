from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path, Query
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,Skill, MentorSkill
from .auth import get_current_user, Roles
from passlib.context import CryptContext
from starlette import status
from sqlalchemy import and_

router = APIRouter(
    prefix='/user',
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
    role : Roles

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    userType: str

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
async def create_user(db : db_dependency, new_user : CreateUserRequest):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.mail == new_user.mail).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        user_model = User(
            name = new_user.name,
            mail = new_user.mail,
            pwd = bcrypt_context.hash(new_user.pwd),
            role = new_user.role
        )
        db.add(user_model)
        db.commit()
        return {"Message": "User Created", 'status_code': 200}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )

@router.post('/register', status_code=200)
async def register_user(db: db_dependency, register_data: RegisterRequest):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.mail == register_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        user_model = User(
            name=register_data.name,
            mail=register_data.email,
            pwd=bcrypt_context.hash(register_data.password),
            role=register_data.userType
        )
        db.add(user_model)
        db.commit()
        return {"Message": "User Created", 'status_code': 200}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )

@router.get('/all_users')
async def view_all_users(db: db_dependency):
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
    exp : int
    github_id : str
    contact : str
    gender : str

@router.put("/mentor/profile_creation", status_code=200)
async def mentor_profile_completion(user : user_dependency, db : db_dependency, mentor_pro : Mentor_Profile):  
    try: 
        if user is None or user.get('role') != 'mentor':
            return HTTPException(status_code=401, detail="Authentication Error")
        
        # Print received data for debugging
        print(f"Received mentor profile data: {mentor_pro}")
        
        mentor_updates = db.query(User).filter(User.id == user.get('user_id')).first()
        if mentor_updates is None:
            raise HTTPException(status_code=404, detail='Mentor not found')
        
        # Update mentor profile fields
        mentor_updates.name = mentor_pro.name
        mentor_updates.exp = mentor_pro.exp
        
        # Handle github_id field
        if mentor_pro.github_id and mentor_pro.github_id.strip():
            # Check if github_id is already used by another user
            existing_user = db.query(User).filter(
                and_(
                    User.github_id == mentor_pro.github_id.strip(),
                    User.id != user.get('user_id')
                )
            ).first()
            
            if existing_user:
                raise HTTPException(
                    status_code=400, 
                    detail=f"GitHub ID '{mentor_pro.github_id}' is already in use by another user. Please use a different GitHub ID."
                )
            mentor_updates.github_id = mentor_pro.github_id.strip()
        else:
            mentor_updates.github_id = None
            
        mentor_updates.contact = mentor_pro.contact
        mentor_updates.gender = mentor_pro.gender.lower()  # Ensure consistent casing
        mentor_updates.profile_completed = True
        
        db.add(mentor_updates)
        db.commit()
        
        return {"message": "Mentor profile updated", "status_code": 200}
    except HTTPException as e:
        db.rollback()
        print(f"HTTP Exception in mentor profile completion: {e.detail}")
        raise e
    except Exception as e:
        db.rollback()
        # Log the actual error for debugging
        print(f"Error in mentor profile completion: {str(e)}")
        # Return a more user-friendly error message
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(
                status_code=400, 
                detail="The GitHub ID you provided is already in use. Please use a different GitHub ID."
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

class Skillset(BaseModel):
    skill_name : str
    proficiency : int = Field(gt=0, lt=6)

class SkillAdd(BaseModel):
    skills : List[Skillset]


@router.post('/mentor/skills')
async def update_skills(user : user_dependency, db : db_dependency, skills_list: SkillAdd): # user : user_dependency
    try:
        if user is None or user.get('role') != 'mentor':
            return HTTPException(status_code=401, detail="Authentication Error")
        
        # Print received skills for debugging
        print(f"Received mentor skills: {skills_list.skills}")
        
        skills_list = skills_list.skills
        # Process each skill
        for skill in skills_list:
            # Check if skill already exists in database
            skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            if skill_model is None:
                # Create new skill if it doesn't exist
                skill_model = Skill(
                    name = skill.skill_name
                )
                db.add(skill_model)
                db.commit()
                # Get the newly created skill
                skill_model = db.query(Skill).filter(Skill.name == skill.skill_name).first()
            
            # Check if mentor already has this skill
            existing_skill = db.query(MentorSkill).filter(
                MentorSkill.mentor_id == user.get('user_id'),
                MentorSkill.skill_id == skill_model.id
            ).first()
            
            # If mentor doesn't have this skill, add it
            if not existing_skill:
                skill_assign = MentorSkill(
                    mentor_id = user.get('user_id'),
                    skill_id = skill_model.id,
                    proficiency = skill.proficiency
                )
                db.add(skill_assign)
            else:
                # Update proficiency if skill already exists
                existing_skill.proficiency = skill.proficiency
                
        db.commit()
        return {"message": "Mentor skills updated", "status_code": 200}
    except Exception as e:
        db.rollback()
        # Log the actual error for debugging
        print(f"Error updating mentor skills: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
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
        'github_id' : mentor_updates.github_id,
        'contact' : mentor_updates.contact,
        'gender' : mentor_updates.gender,
        'Skill set' : skills_model
    }
    return profile_details

# Add new endpoint to get user by email
@router.get("/")
async def get_user_by_email(email: str = Query(..., description="Email of the user"), db: db_dependency = None):
    user = db.query(User).filter(User.mail == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "name": user.name,
        "mail": user.mail,
        "role": user.role,
        "profile_completed": user.profile_completed
    }
