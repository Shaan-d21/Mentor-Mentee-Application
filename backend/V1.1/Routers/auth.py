from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from models import User
from database import SessionLocal
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from starlette import status
from passlib.context import CryptContext
from enum import Enum
router = APIRouter(
    prefix='/authentication',
    tags=['authentication']
)
SECRET_KEY = 'f7458ea66f73cac978f1233a9c9622dd8795bc98a59b2bd26622b58872212385'
ALGORITHM = 'HS256'
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
o2auth_bearer = OAuth2PasswordBearer(tokenUrl='authentication/login')
class Roles(str, Enum):
    mentor = 'mentor'
    mentee = 'mentee'
    admin = 'admin'
class Create_User_Request(BaseModel):
    name: str
    mail: str
    pwd: str
    role: Roles
class Token(BaseModel):
    access_token: str
    token_type: str
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


class Login_Request(BaseModel):
    email : str
    password: str


# Login form
@router.post('/login', response_model=Token)
async def login_for_access_token(login_req : Login_Request, db: db_dependency):
    user = authenticate_user(login_req.email, login_req.password, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    token = user_access_token(user.mail, user.id, user.role, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}