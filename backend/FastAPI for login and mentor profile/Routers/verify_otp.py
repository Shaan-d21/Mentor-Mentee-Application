from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal  # Adjust import path
from models import OTP  # Your OTP model
from sqlalchemy import desc

router = APIRouter(prefix="/verification",tags=["OTP"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Request Body
class OTPVerifyRequest(BaseModel):
    mail: str
    otp: str

# Response Schema
class OTPVerifyResponse(BaseModel):
    status_code: int
    Message: str

@router.post("/verify-otp", response_model=OTPVerifyResponse)
def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    # Fetch latest unused OTP for the mail
    otp_entry = (
        db.query(OTP)
        .filter(OTP.mailid == request.mail)
        .order_by(desc(OTP.created_at))
        .first()
    )

    if not otp_entry:
        return {"status_code": 404, "Message": "OTP Not Found!!!"}
    
    if otp_entry.is_used == True:
        print(OTP.is_used)
        return {"status_code": 400, "Message": "OTP Expired"}

    # Check expiration
    if datetime.now() > otp_entry.valid_upto:
        return {"status_code": 400, "Message": "OTP Expired"}

    # Check OTP match
    if otp_entry.otp == request.otp:
        otp_entry.is_used = True
        db.commit()
        return {"status_code": 200, "Message": "Verified"}
    
    return {"status_code": 401, "Message": "Unverified"}
