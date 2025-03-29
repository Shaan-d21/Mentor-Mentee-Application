from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from typing import Optional

router = APIRouter()

@router.put("/mentee/profile_creation")
async def update_mentee_profile(
    profile_data: dict,
    db: Session = Depends(get_db)
):
    try:
        # Get user from database
        user = db.query(models.User).filter(models.User.mail == profile_data["mail"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update user profile
        user.name = profile_data["name"]
        user.contact = profile_data["contact"]
        user.gender = profile_data["gender"].lower()  # Convert to lowercase to match constraint
        user.profile_completed = True
        
        # Commit changes
        db.commit()
        return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

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