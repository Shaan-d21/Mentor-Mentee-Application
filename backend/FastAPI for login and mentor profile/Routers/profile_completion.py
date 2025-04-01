from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from database import get_db
import models
from typing import Optional, List
from pydantic import BaseModel, Field
from .auth import get_current_user

router = APIRouter()

class MenteeProfileUpdate(BaseModel):
    name: str
    exp: int
    github_id: str
    contact: str
    gender: str

class Skillset(BaseModel):
    skill_name: str
    proficiency: int = Field(gt=0, lt=6)

class SkillAdd(BaseModel):
    skills: List[Skillset]

@router.put("/mentee/profile_creation")
async def update_mentee_profile(
    profile_data: MenteeProfileUpdate,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Verify user is a mentee
        if user is None or user.get('role') != 'mentee':
            raise HTTPException(status_code=401, detail="Authentication Error")
            
        # Print received data for debugging
        print(f"Received mentee profile data: {profile_data}")
            
        # Get user from database
        user_model = db.query(models.User).filter(models.User.id == user.get('user_id')).first()
        if not user_model:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user profile
        user_model.name = profile_data.name
        user_model.contact = profile_data.contact
        user_model.gender = profile_data.gender.lower()  # Convert to lowercase to match constraint
        user_model.exp = profile_data.exp
        
        # Handle github_id field
        if profile_data.github_id and profile_data.github_id.strip():
            # Check if github_id is already used by another user
            existing_user = db.query(models.User).filter(
                and_(
                    models.User.github_id == profile_data.github_id.strip(),
                    models.User.id != user.get('user_id')
                )
            ).first()
            
            if existing_user:
                raise HTTPException(
                    status_code=400, 
                    detail=f"GitHub ID '{profile_data.github_id}' is already in use by another user. Please use a different GitHub ID."
                )
            user_model.github_id = profile_data.github_id.strip()
        else:
            user_model.github_id = None
            
        user_model.profile_completed = True
        
        # Commit changes
        db.commit()
        return {"message": "Profile updated successfully"}
    except HTTPException as e:
        db.rollback()
        print(f"HTTP Exception in mentee profile completion: {e.detail}")
        raise e
    except Exception as e:
        db.rollback()
        # Log the actual error for debugging
        print(f"Error in mentee profile completion: {str(e)}")
        # Return a more user-friendly error message
        if "duplicate key value violates unique constraint" in str(e):
            raise HTTPException(
                status_code=400, 
                detail="The GitHub ID you provided is already in use. Please use a different GitHub ID."
            )
        raise HTTPException(status_code=400, detail=str(e))

@router.post('/mentee/skills')
async def update_mentee_skills(
    skills_list: SkillAdd,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Verify user is a mentee
        if user is None or user.get('role') != 'mentee':
            raise HTTPException(status_code=401, detail="Authentication Error")
            
        # Process each skill
        for skill in skills_list.skills:
            # Check if skill exists in database
            skill_model = db.query(models.Skill).filter(models.Skill.name == skill.skill_name).first()
            
            # If skill doesn't exist, create it
            if skill_model is None:
                skill_model = models.Skill(
                    name=skill.skill_name
                )
                db.add(skill_model)
                db.commit()
                # Get the newly created skill
                skill_model = db.query(models.Skill).filter(models.Skill.name == skill.skill_name).first()
            
            # Check if mentee already has this skill
            existing_skill = db.query(models.MenteeSkill).filter(
                models.MenteeSkill.mentee_id == user.get('user_id'),
                models.MenteeSkill.skill_id == skill_model.id
            ).first()
            
            # If mentee doesn't have this skill, add it
            if not existing_skill:
                # Note: The MenteeSkill model needs to have a proficiency field
                # Make sure it's added to the models.py file if not already present
                mentee_skill = models.MenteeSkill(
                    mentee_id=user.get('user_id'),
                    skill_id=skill_model.id,
                    proficiency=skill.proficiency if hasattr(models.MenteeSkill, 'proficiency') else 1
                )
                db.add(mentee_skill)
            else:
                # Update proficiency if skill already exists and model has the field
                if hasattr(models.MenteeSkill, 'proficiency'):
                    existing_skill.proficiency = skill.proficiency
                
        db.commit()
        return {"message": "Mentee skills updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/mentee/profile_status")
async def get_profile_status(
    email: str,
    db: Session = Depends(get_db)
):
    try:
        user = db.query(models.User).filter(models.User.mail == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"profile_completed": user.profile_completed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mentor/profile_status")
async def get_mentor_profile_status(
    email: str,
    db: Session = Depends(get_db)
):
    try:
        user = db.query(models.User).filter(models.User.mail == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"profile_completed": user.profile_completed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 