from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict, Any
from database import get_db
from models import User, MentorSkill, Skill
from .auth import get_current_user
from typing import Annotated

router = APIRouter(
    prefix='/get-mentors',
    tags=['mentors']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/", response_model=List[Dict[str, Any]])
async def get_all_mentors(user: user_dependency, db: db_dependency):
    """
    Get all mentors with their skills and details.
    This endpoint requires authentication and returns all mentors in the system.
    """
    try:
        if user is None:
            raise HTTPException(status_code=401, detail="Authentication Error")
        
        # Query all users with role 'mentor' and eager load their skills
        mentors = (
            db.query(User)
            .filter(User.role == 'mentor')
            .options(joinedload(User.mentor_skills).joinedload(MentorSkill.skill))
            .all()
        )
        
        # Format the response
        mentor_list = []
        for mentor in mentors:
            # Get skills
            skills = []
            for skill_rel in mentor.mentor_skills:
                skills.append({
                    "name": skill_rel.skill.name,
                    "proficiency": skill_rel.proficiency
                })
            
            # Create mentor object
            mentor_data = {
                "id": mentor.id,
                "name": mentor.name,
                "exp": mentor.exp or 0,
                "github_id": mentor.github_id or "",
                "profile_pic_url": mentor.profile_pic_url,
                "gender": mentor.gender or "",
                "skills": skills
            }
            
            mentor_list.append(mentor_data)
        
        return mentor_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 