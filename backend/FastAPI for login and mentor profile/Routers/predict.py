from fastapi import APIRouter, HTTPException, status, Depends
from enum import Enum
from services.ai_client import fetch_predictions
from typing import Annotated
from .auth import get_current_user  
from starlette.status import HTTP_401_UNAUTHORIZED

router = APIRouter()

class Domains(str, Enum):
    Database_Backend = 'Database & Backend'
    Cloud_Computing = 'Cloud Computing'
    DevOps_Deployment = 'DevOps & Deployment'
    AI_ML = 'Artificial Intelligence & Machine Learning'
    data_sc_ana = 'Data Science & Analytics'
    S_D = 'Software Development'
    PTM = 'Project & Team Management'
    soft_skills = 'Soft Skills'
    web_dev = 'Web Development'

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/predict/")
async def predict(d: Domains, user: user_dependency):
    if user['role'] != 'mentee':
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Access denied: Only mentees allowed")

    try:
        st = d.value
        mentor_list = await fetch_predictions(st)
        return mentor_list[8:-3]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
