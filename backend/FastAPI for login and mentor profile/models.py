from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime, CheckConstraint, Enum, func
from sqlalchemy.orm import relationship
from database import Base
import enum

# Define enum classes for constrained fields
class UserRole(enum.Enum):
    mentor = "mentor"
    mentee = "mentee"
    admin = "admin"

class Gender(enum.Enum):
    male = "male"
    female = "female"
    others = "others"

class ProficiencyLevel(enum.Enum):
    beginner = 1
    intermediate = 2
    advanced = 3

class TopicStatus(enum.Enum):
    assigned = "assigned"
    marked = "marked"
    completed = "completed"

class MentorMenteeStatus(enum.Enum):
    approved = "approved"
    pending = "pending"
    not_approved = "not approved"

# User model
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    mail = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    pwd = Column(String, nullable=False)  # Kept as original
    role = Column(Enum(UserRole), nullable=False)
    organization_id = Column(Integer, ForeignKey("organization.id", ondelete="CASCADE"), nullable=True)
    domain_id = Column(Integer, ForeignKey("domain.id", ondelete="CASCADE"), nullable=True)
    designation = Column(String, nullable=True)
    exp = Column(Integer, nullable=True)
    profile_pic_url = Column(String, nullable=True)
    contact = Column(String, unique=True, nullable=True)
    
    is_profile_complete = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="users")
    domain = relationship("Domain", back_populates="users")
    mentor_skills = relationship("MentorSkill", back_populates="mentor", cascade="all, delete-orphan")
    mentee_skills = relationship("MenteeSkill", back_populates="mentee", cascade="all, delete-orphan")
    mentorships = relationship("MentorMentee", back_populates="mentor", foreign_keys="[MentorMentee.mentor_id]", cascade="all, delete-orphan")
    menteeships = relationship("MentorMentee", back_populates="mentee", foreign_keys="[MentorMentee.mentee_id]", cascade="all, delete-orphan")
    feedback_sent = relationship("Feedback", back_populates="sender", foreign_keys="[Feedback.sender_id]", cascade="all, delete-orphan")
    feedback_received = relationship("Feedback", back_populates="receiver", foreign_keys="[Feedback.receiver_id]", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.id}: {self.name} ({self.role.name})>"


# Organization model
class Organization(Base):
    __tablename__ = "organization"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Organization {self.id}: {self.name}>"


# Skill model
class Skill(Base):
    __tablename__ = "skill"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    domain_skills = relationship("DomainSkill", back_populates="skill", cascade="all, delete-orphan")
    mentor_skills = relationship("MentorSkill", back_populates="skill", cascade="all, delete-orphan")
    mentee_skills = relationship("MenteeSkill", back_populates="skill", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Skill {self.id}: {self.name}>"


# MentorSkill model
class MentorSkill(Base):
    __tablename__ = "mentor_skill"

    mentor_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skill.id", ondelete="CASCADE"), primary_key=True)
    proficiency = Column(Enum(ProficiencyLevel), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    mentor = relationship("User", back_populates="mentor_skills")
    skill = relationship("Skill", back_populates="mentor_skills")

    def __repr__(self):
        return f"<MentorSkill: Mentor {self.mentor_id}, Skill {self.skill_id}>"


# MenteeSkill model
class MenteeSkill(Base):
    __tablename__ = "mentee_skill"

    mentee_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skill.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    mentee = relationship("User", back_populates="mentee_skills")
    skill = relationship("Skill", back_populates="mentee_skills")

    def __repr__(self):
        return f"<MenteeSkill: Mentee {self.mentee_id}, Skill {self.skill_id}>"


# Domain model
class Domain(Base):
    __tablename__ = "domain"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="domain")
    domain_skills = relationship("DomainSkill", back_populates="domain", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="domain", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Domain {self.id}: {self.name}>"


# DomainSkill model
class DomainSkill(Base):
    __tablename__ = "domain_skill"

    # id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domain.id", ondelete="CASCADE"), primary_key=True, nullable=False)
    skill_id = Column(Integer, ForeignKey("skill.id", ondelete="CASCADE"), nullable=False, primary_key=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    domain = relationship("Domain", back_populates="domain_skills")
    skill = relationship("Skill", back_populates="domain_skills")

    def __repr__(self):
        return f"<DomainSkill {self.id}: Domain {self.domain_id}, Skill {self.skill_id}>"


# Roadmap model
class Roadmap(Base):
    __tablename__ = "roadmap"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domain.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)  # Added name field which was missing
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    domain = relationship("Domain", back_populates="roadmaps")
    topics = relationship("Topic", back_populates="roadmap", cascade="all, delete-orphan")
    mentorships = relationship("MentorMentee", back_populates="roadmap", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Roadmap {self.id}: {self.name} (Domain {self.domain_id})>"


# Topic model
class Topic(Base):
    __tablename__ = "topic"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmap.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(Enum(TopicStatus), nullable=False, default=TopicStatus.assigned)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    roadmap = relationship("Roadmap", back_populates="topics")

    def __repr__(self):
        return f"<Topic {self.id}: {self.name} ({self.status.name})>"


# MentorMentee model
class MentorMentee(Base):
    __tablename__ = "mentor_mentee"

    mentor_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    mentee_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmap.id", ondelete="CASCADE"))
    domain_id = Column(Integer, ForeignKey("domain.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(MentorMenteeStatus), nullable=False, default=MentorMenteeStatus.pending)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    roadmap = relationship("Roadmap", back_populates="mentorships")
    mentor = relationship("User", back_populates="mentorships", foreign_keys=[mentor_id])
    mentee = relationship("User", back_populates="menteeships", foreign_keys=[mentee_id])

    def __repr__(self):
        return f"<MentorMentee: Mentor {self.mentor_id}, Mentee {self.mentee_id}, Status {self.status.name}>"


# Feedback model
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    feedback = Column(Text, nullable=False)
    sender_role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationships
    sender = relationship("User", back_populates="feedback_sent", foreign_keys=[sender_id])
    receiver = relationship("User", back_populates="feedback_received", foreign_keys=[receiver_id])

    def __repr__(self):
        return f"<Feedback {self.id}: From {self.sender_id} To {self.receiver_id}>"