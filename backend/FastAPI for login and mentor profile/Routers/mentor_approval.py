from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import MentorMentee, MentorMentee_rel
from database import SessionLocal
from .auth import get_current_user

router = APIRouter(
    prefix='/mentor-approval',
    tags=['mentor-approval']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class MentorApprovalRequest(BaseModel):
    approved: bool
    mentee_id: int



@router.put("/approve-mentee")
def approve_mentee(current_user: user_dependency, db : db_dependency, approval_request: MentorApprovalRequest):
    if current_user["role"] != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can approve requests.")
    req_model = db.query(MentorMentee_rel).filter(MentorMentee_rel.mentor_id == current_user.get('user_id')).filter(MentorMentee_rel.mentee_id == approval_request.mentee_id).first()
    if req_model is None:
            raise  HTTPException(status_code=404, detail='Mentee not found')  
    req_model.approved = approval_request.approved
    db.add(req_model)
    db.commit()
    
    return {'status_code': 200, 'Message': f'Accept {req_model.approved} '}    



    
    

