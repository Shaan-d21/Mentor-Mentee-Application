from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel
import models
from models import UserRole
from database import SessionLocal, get_db
from AI_Model.roadmap_recommendation import generate_roadmap_content
from .auth import get_current_user
from typing import Annotated
from database import SessionLocal, get_db

# ---- Embedded Schema ----
class GenerateRoadmapRequest(BaseModel):
    domain_id: int
    mentee_id: int

# Set up the router
router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# ----- AI-Generated Roadmap -----
@router.post("/generate/", response_model=Dict[str, Any])
async def generate_roadmap(request: GenerateRoadmapRequest, db: db_dependency, user: user_dependency):
    # Check if domain exists
    # if user is None or user.get("role") != UserRole.mentor:
    #     raise HTTPException(status_code=403, detail="Unauthorized access")
    domain = db.query(models.Domain).filter(models.Domain.id == request.domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    # Check if user is a mentee
    mentee = db.query(models.User).filter(
        models.User.id == request.mentee_id,
        models.User.role == UserRole.mentee
    ).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")
    try:
        # Generate a roadmap using the AI service
        topics_list = generate_roadmap_content(domain.name)
        # Join all topics into a single string to store in the name field
        roadmap_content = "\n".join(topics_list)
        # Create a new roadmap with the topics list as name
        db_roadmap = models.Roadmap(
            domain_id=domain.id,
            name=roadmap_content
        )
        db.add(db_roadmap)
        db.commit()
        db.refresh(db_roadmap)
        return {
            "roadmap_id": db_roadmap.id,
            "roadmap_name": roadmap_content,
            "topics": topics_list,  # Still return the list format for the API response
            "domain": domain.name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")