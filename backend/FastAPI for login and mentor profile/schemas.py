# from pydantic import BaseModel, EmailStr, Field
# from typing import Optional, List, Dict, Any
# from datetime import datetime
# from models import UserRole, Gender, ProficiencyLevel, TopicStatus, MentorMenteeStatus

# # ---- Organization Schemas ----
# class OrganizationBase(BaseModel):
#     name: str

# class OrganizationCreate(OrganizationBase):
#     pass

# class Organization(OrganizationBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# # ---- Domain Schemas ----
# class DomainBase(BaseModel):
#     name: str

# class DomainCreate(DomainBase):
#     pass

# class Domain(DomainBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# # ---- Skill Schemas ----
# class SkillBase(BaseModel):
#     name: str

# class SkillCreate(SkillBase):
#     pass

# class Skill(SkillBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# # ---- User Schemas ----
# class UserBase(BaseModel):
#     name: str
#     mail: EmailStr
#     role: UserRole
#     organization_id: Optional[int] = None
#     domain_id: Optional[int] = None
#     designation: Optional[str] = None
#     exp: Optional[int] = None
#     contact: Optional[str] = None
#     gender: Optional[Gender] = None
#     is_profile_complete: Optional[bool] = False

# class UserCreate(UserBase):
#     pwd: str

# class User(UserBase):
#     id: int
#     profile_pic_url: Optional[str] = None
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# # ---- MentorSkill Schemas ----
# class MentorSkillBase(BaseModel):
#     mentor_id: int
#     skill_id: int
#     proficiency: ProficiencyLevel

# class MentorSkillCreate(MentorSkillBase):
#     pass

# class MentorSkill(MentorSkillBase):
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# class MentorSkillWithDetails(MentorSkill):
#     skill: Skill
    
#     class Config:
#         orm_mode = True

# # ---- MenteeSkill Schemas ----
# class MenteeSkillBase(BaseModel):
#     mentee_id: int
#     skill_id: int

# class MenteeSkillCreate(MenteeSkillBase):
#     pass

# class MenteeSkill(MenteeSkillBase):
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# class MenteeSkillWithDetails(MenteeSkill):
#     skill: Skill
    
#     class Config:
#         orm_mode = True

# # ---- Roadmap Schemas ----
# class RoadmapBase(BaseModel):
#     domain_id: int
#     name: str

# class RoadmapCreate(RoadmapBase):
#     pass

# class Roadmap(RoadmapBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# # ---- Topic Schemas ----
# class TopicBase(BaseModel):
#     roadmap_id: int
#     name: str
#     status: Optional[TopicStatus] = TopicStatus.assigned

# class TopicCreate(TopicBase):
#     pass

# class Topic(TopicBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# class TopicStatusUpdate(BaseModel):
#     status: TopicStatus

# class RoadmapWithTopics(Roadmap):
#     topics: List[Topic] = []
    
#     class Config:
#         orm_mode = True

# # ---- MentorMentee Schemas ----
# class MentorMenteeBase(BaseModel):
#     mentor_id: int
#     mentee_id: int
#     roadmap_id: int
#     domain_id: int
#     status: Optional[MentorMenteeStatus] = MentorMenteeStatus.pending
#     comment: Optional[str] = None

# class MentorMenteeCreate(MentorMenteeBase):
#     pass

# class MentorMentee(MentorMenteeBase):
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# class MentorMenteeStatusUpdate(BaseModel):
#     mentor_id: int
#     mentee_id: int
#     roadmap_id: int
#     status: MentorMenteeStatus
#     comment: Optional[str] = None

# class MentorMenteeWithDetails(MentorMentee):
#     mentor: User
#     mentee: User
#     roadmap: Roadmap
    
#     class Config:
#         orm_mode = True

# # ---- Feedback Schemas ----
# class FeedbackBase(BaseModel):
#     sender_id: int
#     receiver_id: int
#     feedback: str
#     sender_role: UserRole

# class FeedbackCreate(FeedbackBase):
#     pass

# class Feedback(FeedbackBase):
#     id: int
#     created_at: datetime
#     updated_at: datetime
    
#     class Config:
#         orm_mode = True

# class FeedbackWithDetails(Feedback):
#     sender: User
#     receiver: User
    
#     class Config:
#         orm_mode = True

# # ---- AI Roadmap Generation Schemas ----
# class GenerateRoadmapRequest(BaseModel):
#     domain_id: int
#     mentee_id: int

# class RoadmapResponse(BaseModel):
#     roadmap_id: int
#     content: str

# class AssignRoadmapRequest(BaseModel):
#     roadmap_id: int
#     mentee_id: int
#     mentor_id: int  # Optional if you want to assign a specific mentor

# class AssignRoadmapResponse(BaseModel):
#     success: bool
#     mentor_mentee_id: Optional[int] = None
#     roadmap_name: Optional[str] = None
#     topics: Optional[List[str]] = None
#     message: str