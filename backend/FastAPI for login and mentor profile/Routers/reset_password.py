from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, Path
from pydantic import BaseModel, Field
from database import SessionLocal
from sqlalchemy.orm import Session
from models import User,OTP
from starlette import status
from passlib.context import CryptContext

router = APIRouter(
    prefix='/OTP',
    tags=['OTP']
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'],deprecated = 'auto')

class ChangePasswordRequest(BaseModel):
    mail: str
    pwd: str

@router.patch('/change_password')
async def change_password(db : db_dependency, req: ChangePasswordRequest):
    user_model = db.query(User).filter(User.mail == req.mail).first()
    if user_model is None:
        raise HTTPException(status_code = 404, detail = 'User not found')
    user_model.pwd = bcrypt_context.hash(req.pwd)
    db.add(user_model)
    db.commit()
    otp_model = db.query(OTP).filter(OTP.mailid == req.mail).all()
    if otp_model is not None:
        for i in otp_model:
            db.query(OTP).filter(OTP.id == i.id).delete()
    db.commit()
    return {'status_code': 200, 'Message': 'Password changed Successfully'}
