from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel, EmailStr, Field, validator
from models import User
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from starlette import status
from passlib.context import CryptContext
from enum import Enum
import re
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib

router = APIRouter(
    prefix='/auth',
    tags=['authentication']
)
SECRET_KEY = 'f7458ea66f73cac978f1233a9c9622dd8795bc98a59b2bd26622b58872212385'
ALGORITHM = 'HS256'
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
o2auth_bearer = OAuth2PasswordBearer(tokenUrl='/api/v1/auth/login')

# OTP storage (in a real application, this should be in a database)
otp_store = {}  # email -> {'otp': '123456', 'expires_at': timestamp}

class Roles(str, Enum):
    mentor = 'mentor'
    mentee = 'mentee'
    admin = 'admin'

class Create_User_Request(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password: str = Field(..., min_length=5)
    userType: str = Field(..., description="User type: mentor, mentee, or admin")
    
    @validator('userType')
    def validate_user_type(cls, v):
        if v.lower() not in ['mentor', 'mentee', 'admin']:
            raise ValueError(f'Invalid user type: {v}. Must be mentor, mentee, or admin')
        return v

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str
    userType: str = Field(..., description="User type: mentor, mentee, or admin")

class OTPRequest(BaseModel):
    email: str

class OTPVerification(BaseModel):
    email: str
    otp: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency = Annotated[Session, Depends(get_db)]

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.mail == email).first()
    if user is None or not bcrypt_context.verify(password, user.pwd):
        return None
    return user

def user_access_token(email: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': email, 'id': user_id, 'role': role}
    expiry = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expiry})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(o2auth_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        mail: str = payload.get('sub')
        user_id: int = payload.get('id')
        role: str = payload.get('role')
        if mail is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')
        return {'email': mail, 'user_id': user_id, 'role': role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')

# Login form
@router.post('/login', response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    token = user_access_token(user.mail, user.id, user.role, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}

# Direct login API for frontend
@router.post('/login/api')
async def login_api(
    user_data: LoginRequest,
    db: db_dependency
):
    # Authenticate the user
    user = db.query(User).filter(User.mail == user_data.email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate the password first
    if not bcrypt_context.verify(user_data.password, user.pwd):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Validate that the user's role matches the requested role
    if user.role.lower() != user_data.userType.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This account is registered as a {user.role}, not a {user_data.userType}"
        )
    
    # Generate token
    token = user_access_token(user.mail, user.id, user.role, timedelta(minutes=20))
    
    # Return user information along with the token
    return {
        'access_token': token,
        'token_type': 'bearer',
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.mail,
            'role': user.role
        }
    }

@router.post('/register')
async def register_user(
    user_request: Create_User_Request,
    db: db_dependency
):
    try:
        # Debug the incoming request data
        print("Received registration request:")
        print(f"Name: {user_request.name}")
        print(f"Email: {user_request.email}")
        print(f"Password: {'*' * len(user_request.password)}")  # Don't log actual password
        print(f"UserType: {user_request.userType}")
        
        # Check if user with email already exists
        user_exists = db.query(User).filter(User.mail == user_request.email).first()
        if user_exists:
            print(f"User with email {user_request.email} already exists")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User with this email already exists')
        
        # Create new user with proper validation of user type
        # Make sure userType is lowercase to match enum values
        user_type = user_request.userType.lower() 
        if user_type not in ['mentor', 'mentee', 'admin']:
            print(f"Invalid user type: {user_request.userType}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Invalid user type: {user_request.userType}. Must be mentor, mentee, or admin')
        
        print(f"Creating user: {user_request.name}, {user_request.email}, {user_type}")
        
        new_user = User(
            name=user_request.name,
            mail=user_request.email,
            pwd=bcrypt_context.hash(user_request.password),
            role=user_type
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("User registered successfully")
        return {"message": "User registered successfully"}
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        # Log unexpected errors and return a 500
        print(f"Error in user registration: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Server error: {str(e)}")

# Alternative registration endpoint that accepts raw JSON
@router.post('/register/raw')
async def register_user_raw(
    db: db_dependency,
    request_data: dict = Body(...)
):
    try:
        # Debug the incoming raw request data
        print("Received raw registration request:")
        print(f"Request data: {request_data}")
        
        # Extract and validate fields
        if not all(k in request_data for k in ['name', 'email', 'password', 'userType']):
            missing_fields = [k for k in ['name', 'email', 'password', 'userType'] if k not in request_data]
            print(f"Missing fields: {missing_fields}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        name = request_data['name']
        email = request_data['email']
        password = request_data['password']
        user_type = request_data['userType'].lower()
        
        # Validate name length
        if len(name) < 2:
            print(f"Name too short: {name}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name must be at least 2 characters")
            
        # Validate password length
        if len(password) < 5:  # Changed from 6 to 5
            print(f"Password too short: {len(password)} characters")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 5 characters")
        
        # Validate email format
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
            print(f"Invalid email format: {email}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format")
        
        # Validate user type
        if user_type not in ['mentor', 'mentee', 'admin']:
            print(f"Invalid user type: {user_type}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Invalid user type: {user_type}. Must be mentor, mentee, or admin"
            )
        
        try:
            print("Checking if user exists in database...")
            # Check if user with email already exists
            user_exists = db.query(User).filter(User.mail == email).first()
            print(f"User exists check result: {user_exists is not None}")
            
            if user_exists:
                print(f"User with email {email} already exists")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User with this email already exists')
            
            print(f"Creating user: {name}, {email}, {user_type}")
            
            # Create new user
            new_user = User(
                name=name,
                mail=email,
                pwd=bcrypt_context.hash(password),
                role=user_type
            )
            
            print("Adding user to database session...")
            db.add(new_user)
            
            print("Committing to database...")
            db.commit()
            
            print("Refreshing user object...")
            db.refresh(new_user)
            
            print("User registered successfully")
            return {"message": "User registered successfully"}
        except Exception as db_error:
            print(f"Database operation error: {str(db_error)}")
            # Roll back the transaction on error
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(db_error)}"
            )
            
    except HTTPException as e:
        print(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        # Log unexpected errors and return a 500
        print(f"Error in raw user registration: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Server error: {str(e)}")

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(email: str, otp: str):
    """Send OTP via email"""
    try:
        print(f"Sending OTP {otp} to {email}")
        # In a real application, you would send an actual email
        # For this example, we'll just print it
        
        # Example of how you might send an email:
        # sender_email = "your-email@gmail.com"
        # password = "your-password"
        # 
        # message = MIMEMultipart()
        # message["From"] = sender_email
        # message["To"] = email
        # message["Subject"] = "Your OTP for verification"
        # 
        # body = f"Your OTP for verification is: {otp}\nValid for 5 minutes."
        # message.attach(MIMEText(body, "plain"))
        # 
        # with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        #     server.login(sender_email, password)
        #     server.sendmail(sender_email, email, message.as_string())
        
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False

@router.post('/auth/send-otp')
async def send_otp(
    request: OTPRequest,
    db: db_dependency
):
    """Send OTP to user's email"""
    email = request.email.strip().lower()  # Normalize email to lowercase
    
    # Check if the email exists in the database
    user = db.query(User).filter(User.mail == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    
    # Generate OTP
    otp = generate_otp()
    
    # Store OTP with expiration time (5 minutes from now)
    expiry = datetime.now() + timedelta(minutes=5)
    otp_store[email] = {
        'otp': otp,
        'expires_at': expiry
    }
    
    # Send OTP email
    success = send_otp_email(email, otp)
    if not success:
        raise HTTPException(
            status_code=500, 
            detail="Failed to send OTP email"
        )
    
    return {"message": "OTP sent successfully"}

@router.post('/resend-otp')
async def resend_otp(
    request: OTPRequest,
    db: db_dependency
):
    """Resend OTP to user's email"""
    email = request.email
    
    # Check if the email exists in the database
    user = db.query(User).filter(User.mail == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email not registered")
    
    # Generate new OTP
    otp = generate_otp()
    
    # Store OTP with expiration time (5 minutes from now)
    expiry = datetime.now() + timedelta(minutes=5)
    otp_store[email] = {
        'otp': otp,
        'expires_at': expiry
    }
    
    # Send OTP email
    success = send_otp_email(email, otp)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to send OTP email"
        )
    
    return {"message": "OTP resent successfully"}

@router.post('/verify-otp')
async def verify_otp(
    verification: OTPVerification,
    db: db_dependency
):
    """Verify OTP entered by user"""
    email = verification.email
    submitted_otp = verification.otp
    
    # Check if OTP exists for this email
    if email not in otp_store:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No OTP generated for this email")
    
    # Get stored OTP data
    otp_data = otp_store[email]
    stored_otp = otp_data['otp']
    expiry_time = otp_data['expires_at']
    
    # Check if OTP has expired
    if datetime.now() > expiry_time:
        del otp_store[email]  # Clean up expired OTP
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")
    
    # Check if OTP matches
    if submitted_otp != stored_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
    
    # OTP is valid, clean up the stored OTP
    del otp_store[email]
    
    return {"message": "OTP verified successfully"}