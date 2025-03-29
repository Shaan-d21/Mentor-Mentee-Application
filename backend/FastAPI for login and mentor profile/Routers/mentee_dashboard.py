from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from typing import List

router = APIRouter()

@router.get("/mentee/approved-mentors")
async def get_approved_mentors(
    db: Session = Depends(get_db)
):
    try:
        # Get the current user's ID from the token
        # This would be handled by your authentication middleware
        # For now, we'll return all approved mentors
        approved_mentors = db.query(models.MentorMentee).filter(
            models.MentorMentee.approved == True
        ).all()

        # Transform the data to match the frontend interface
        mentors_data = []
        for mentor_mentee in approved_mentors:
            mentor = mentor_mentee.mentor
            mentors_data.append({
                "id": mentor.id,
                "name": mentor.name,
                "mail": mentor.mail,
                "domain": mentor.domain,
                "status": "in_progress",  # This could be dynamic based on your requirements
                "progress": 0,  # This could be calculated based on your requirements
                "comments": ""  # This could be added from a separate table
            })

        return mentors_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 