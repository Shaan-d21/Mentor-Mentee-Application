from typing import Annotated
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from pydantic import BaseModel
from enum import Enum
from starlette import status
import pickle

from Routers.auth import get_current_user

router = APIRouter(
    prefix='/matching',
    tags=['matching']
)

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


class Domain(BaseModel):
    choise : Domains
user_dependency = Annotated[dict, Depends(get_current_user)]
