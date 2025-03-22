# Import necessary modules from SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

# Create a base class for declarative models
from database import base

# Define the User model
class User(base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mail = Column(String, unique=True, nullable=False)
    pwd = Column(String, nullable=False)
    role = Column(String, CheckConstraint("role IN ('mentor', 'mentee', 'admin')"), nullable=False)
    organization_id = Column(Integer, ForeignKey('organization.id'), nullable=True)
    exp = Column(Integer, nullable=True)
    github_id = Column(String, unique=True, nullable=True)
    profile_pic_url = Column(String, nullable=True)
    contact = Column(String, unique=True, nullable=True)
    gender = Column(String, CheckConstraint("gender IN ('male', 'female', 'others')"), nullable=True)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    mentor_skills = relationship("MentorSkill", back_populates="mentor")
    mentee_courses = relationship("MenteeCourse", foreign_keys="[MenteeCourse.mentee_id]", back_populates="mentee")
    mentor_mentees = relationship("MentorMentee", foreign_keys="[MentorMentee.mentor_id]", back_populates="mentor")
    feedback_sent = relationship("Feedback", foreign_keys="[Feedback.sender_id]", back_populates="sender")
    feedback_received = relationship("Feedback", foreign_keys="[Feedback.receiver_id]", back_populates="receiver")

# Define the Organization model
class Organization(base):
    __tablename__ = 'organization'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    
    users = relationship("User", back_populates="organization")

# Define the Skill model
class Skill(base):
    __tablename__ = 'skill'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    mentor_skills = relationship("MentorSkill", back_populates="skill")

# Define the MentorSkill model
class MentorSkill(base):
    __tablename__ = 'mentor_skill'
    
    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey('user.id'))
    skill_id = Column(Integer, ForeignKey('skill.id'))
    proficiency = Column(Float, CheckConstraint("proficiency IN (1, 2, 3)"), nullable=False)

    mentor = relationship("User", back_populates="mentor_skills")
    skill = relationship("Skill", back_populates="mentor_skills")

# Define the Domain model
class Domain(base):
    __tablename__ = 'domain'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    courses = relationship("Course", back_populates="domain")

# Define the Course model
class Course(base):
    __tablename__ = 'course'
    
    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey('domain.id'))
    name = Column(String, nullable=False)
    link = Column(String, nullable=False)

    domain = relationship("Domain", back_populates="courses")
    mentee_courses = relationship("MenteeCourse", back_populates="course")
    mentor_mentees = relationship("MentorMentee", back_populates="course")

# Define the MenteeCourse model
class MenteeCourse(base):
    __tablename__ = 'mentee_course'
    
    id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey('user.id'))
    mentor_id = Column(Integer, ForeignKey('user.id'))
    course_id = Column(Integer, ForeignKey('course.id'))
    rating = Column(Float, nullable=False)

    mentee = relationship("User", foreign_keys=[mentee_id], back_populates="mentee_courses")
    mentor = relationship("User", foreign_keys=[mentor_id])
    course = relationship("Course", back_populates="mentee_courses")

# Define the MentorMentee model
class MentorMentee(base):
    __tablename__ = 'mentor_mentee'
    
    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey('user.id'))
    mentee_id = Column(Integer, ForeignKey('user.id'))
    course_id = Column(Integer, ForeignKey('course.id'))
    duration = Column(Integer, nullable=False)
    approved = Column(Boolean, nullable=False)

    mentor = relationship("User", foreign_keys=[mentor_id], back_populates="mentor_mentees")
    mentee = relationship("User", foreign_keys=[mentee_id])
    course = relationship("Course", back_populates="mentor_mentees")

# Define the Feedback model
class Feedback(base):
    __tablename__ = 'feedback'
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('user.id'))
    receiver_id = Column(Integer, ForeignKey('user.id'))
    feedback = Column(String, nullable=False)
    sender_role = Column(String, CheckConstraint("sender_role IN ('mentor', 'mentee')"), nullable=False)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="feedback_sent")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="feedback_received")

# Pydantic models for request and response validation
from pydantic import BaseModel, validator
from typing import Optional

class UserCreate(BaseModel):
    organization_id: Optional[int] = None
    name: str
    pwd: str
    role: str
    exp: Optional[int] = None
    github_id: Optional[str] = None
    profile_pic_url: Optional[str] = None
    contact: Optional[str] = None
    mail: str
    gender: Optional[str] = None

    @validator('role')
    def validate_role(cls, v):
        allowed_roles = {'mentor', 'mentee', 'admin'}
        if v not in allowed_roles:
            raise ValueError("Role must be 'mentor', 'mentee', or 'admin'")
        return v

    @validator('gender')
    def validate_gender(cls, v):
        allowed_genders = {'male', 'female', 'others'}
        if v and v not in allowed_genders:
            raise ValueError("Gender must be 'male', 'female', or 'others'")
        return v

class UserResponse(BaseModel):
    id: int
    name: str
    role: str
    mail: str

    class Config:
        orm_mode = True  # Enable ORM mode for Pydantic model
