import enum
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, model_validator
from sqlalchemy.orm import Session
from models import MentorMentee
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


class MentorMenteeStatus(enum.Enum):
    approved = "approved"
    not_approved = "not approved"
    
class MentorApprovalRequest(BaseModel):
    status : MentorMenteeStatus
    mentee_id: int
    comment: Optional[str] = None

    @model_validator(mode='after')
    def check_comment_for_not_approved(self):
        if self.status == MentorMenteeStatus.not_approved and (self.comment is None or self.comment.strip() == ""):
            raise ValueError("Comment is required when status is 'not approved'.")
        return self

@router.put("/approve-mentee")
def approve_mentee(
    current_user: user_dependency,
    db: db_dependency,
    approval_request: MentorApprovalRequest
):
    if current_user["role"] != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can approve requests.")

    req_model = db.query(MentorMentee).filter(
        MentorMentee.mentor_id == current_user.get('user_id'),
        MentorMentee.mentee_id == approval_request.mentee_id
    ).first()

    if req_model is None:
        raise HTTPException(status_code=404, detail='Mentee not found')

    req_model.status = approval_request.status.name
    req_model.comment = approval_request.comment  # Save the comment

    db.add(req_model)
    db.commit()

    return {
        'status_code': 200,
        'message': f'Status updated to {req_model.status}',
        'comment': req_model.comment
    }