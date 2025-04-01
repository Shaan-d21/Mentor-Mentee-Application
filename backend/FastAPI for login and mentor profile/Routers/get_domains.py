from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from database import get_db
from models import Domains
from .auth import get_current_user
from typing import Annotated

router = APIRouter(
    prefix='/domains',
    tags=['domains']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/", response_model=List[Dict])
async def get_all_domains(user: user_dependency, db: db_dependency):
    """
    Get all available domains for mentorship.
    This endpoint requires authentication.
    """
    try:
        if user is None:
            raise HTTPException(status_code=401, detail="Authentication Error")
        
        # Query all domains
        domains = db.query(Domains).all()
        
        # Format the response
        domain_list = [{"id": domain.id, "name": domain.name} for domain in domains]
        
        return domain_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 