from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Annotated
from pydantic import BaseModel
import models
from models import UserRole
from services.ai_client import fetch_roadmap
from database import SessionLocal
from .auth import get_current_user

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])

class GenerateRoadmapRequest(BaseModel):
    domain_id: int
    mentee_id: int

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/generate/", status_code=status.HTTP_200_OK)
async def generate_roadmap(
    request: GenerateRoadmapRequest,
    db: db_dependency,
    user: user_dependency
):
    if user is None or user.get('role') != 'mentor':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized Access"
        )

    domain = db.query(models.Domain).filter(models.Domain.id == request.domain_id).first()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")

    mentee = db.query(models.User).filter(
        models.User.id == request.mentee_id,
        models.User.role == UserRole.mentee
    ).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")

    try:
        ai_response = await fetch_roadmap(request.domain_id, request.mentee_id)

        # topics_list = ai_response.get("topics", [])
        # roadmap_content = ai_response.get("roadmap_name", "")
        # domain_name = ai_response.get("domain", domain.name)
        # roadmap_id = ai_response.get("roadmap_id", None)

        # # db_roadmap = models.Roadmap(
        # #     domain_id=domain.id,
        # #     name=roadmap_content
        # # )
        # # db.add(db_roadmap)
        # # db.commit()
        # # db.refresh(db_roadmap)

        # # Append roadmap_id before returning
        # ai_response["roadmap_id"] = roadmap_id
        # ai_response["domain"] = domain_name
        
        return ai_response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating roadmap: {str(e)}"
        )
