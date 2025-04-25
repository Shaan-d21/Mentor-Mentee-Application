import os
from typing import Annotated
from starlette import status
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from .auth import get_current_user
from models import OTP, User
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(
    prefix='/verification',
    tags=['otp']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency =  Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# retrieve the user from the email
def getting_user_object(mail: str, db: Session):
    user = db.query(User).filter(User.mail == mail).first()
    return user

def generate_otp():
    import random
    return str(random.randint(1000, 9999))

def storing_otp(otp: str, mail: str, db: Session):
    try:
        otp_model = OTP(
        mailid = mail,
        otp = otp, # it will be valid upto 5 min of the creation time
        )
        db.add(otp_model)
        db.commit()
        return True
    except:
        return False
    
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_mail_with_otp(otp: str, mail: str):
    EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
    EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 465))

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Password Reset Request"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = mail

    html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f8f9fa;
                    color: #333333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
                }}
                .header {{
                    background-color: #0052cc;
                    color: #ffffff;
                    padding: 24px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 26px;
                    font-weight: 600;
                }}
                .content {{
                    padding: 32px;
                    text-align: center;
                }}
                .content p {{
                    color: #4a4a4a;
                    line-height: 1.7;
                    margin: 0 0 20px;
                    font-size: 16px;
                }}
                .otp-container {{
                    margin: 30px 0;
                }}
                .otp-heading {{
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }}
                .otp-box {{
                    background-color: #f2f7ff;
                    border: 1px solid #e1e8f0;
                    border-radius: 6px;
                    padding: 18px;
                    font-size: 28px;
                    font-weight: bold;
                    color: #0052cc;
                    letter-spacing: 8px;
                    display: inline-block;
                    min-width: 180px;
                }}
                .note {{
                    font-size: 14px;
                    color: #666666;
                    font-style: italic;
                    margin-top: 12px;
                }}
                .expiry-note {{
                    background-color: #fff8e1;
                    border-left: 3px solid #ffc107;
                    padding: 12px 16px;
                    margin: 25px 0;
                    text-align: left;
                    border-radius: 4px;
                }}
                .expiry-note p {{
                    margin: 0;
                    font-size: 14px;
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 13px;
                    color: #666666;
                    border-top: 1px solid #eaeaea;
                }}
                .footer p {{
                    margin: 6px 0;
                }}
                .footer a {{
                    color: #0052cc;
                    text-decoration: none;
                }}
                @media (max-width: 600px) {{
                    .container {{
                        margin: 10px;
                        border-radius: 6px;
                    }}
                    .content {{
                        padding: 24px 20px;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Please use the verification code below to complete your password reset:</p>
                    
                    <div class="otp-container">
                        <div class="otp-heading">Verification Code</div>
                        <div class="otp-box">{otp}</div>
                        <div class="note">Simply copy this code and paste it in the password reset form</div>
                    </div>
                    
                    <div class="expiry-note">
                        <p><strong>Important:</strong> This verification code will expire in 5 minutes for security reasons.</p>
                    </div>
                    
                    <p>If you didn't request a password reset, please disregard this email or contact our support team immediately.</p>
                </div>
                <div class="footer">
                    <p>© 2025 Promact. All rights reserved.</p>
                    <p>Need assistance? Contact us at <a href="mailto:saptarshibanik123@gmail.com">saptarshibanik123@gmail.com</a></p>
                </div>
            </div>
        </body>
        </html>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, mail, msg.as_string())
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

@router.get('/otp')
def verify_email_and_send_otp_to_mail(mail: str, db: db_dependency):
    user = getting_user_object(mail, db)
    if user is None:
        raise HTTPException(status_code=404, detail='Email not found')
    
    otp = generate_otp()

    if storing_otp(otp, mail, db):
        if send_mail_with_otp(otp, mail):
            return {"status_code": 200, "Message": "OTP sent to email successfully"}
        else:
            return {"status_code": 400, "Message": "There are some problem while sending otp"}
    else:
        return {"status_code": 400, "Message": "There are some problem while generating otp"}


    
    
