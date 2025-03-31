from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from database import Base

# User model
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=True)
    name = Column(String, nullable=False)
    pwd = Column(String, nullable=False)
    role = Column(String, nullable=False, check_constraint="role IN ('mentor', 'mentee', 'admin')")
    designation = Column(String, nullable=True)
    exp = Column(Integer, nullable=True)
    profile_pic_url = Column(String, nullable=True)
    contact = Column(String, unique=True, nullable=True)
    mail = Column(String, unique=True, nullable=False)
    gender = Column(String, nullable=True, check_constraint="gender IN ('male', 'female', 'others')")

    # Relationships
    organization = relationship("Organization")
    mentor_skills = relationship("MentorSkill", back_populates="mentor")
    mentee_skills = relationship("MenteeSkill", back_populates="mentee")

# Organization model
class Organization(Base):
    __tablename__ = "organization"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

# Skill model
class Skill(Base):
    __tablename__ = "skill"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    domain_skills = relationship("DomainSkill", back_populates="skill")

# MentorSkill model
class MentorSkill(Base):
    __tablename__ = "mentor_skill"

    mentor_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skill.id"), primary_key=True)
    proficiency = Column(Integer, nullable=False, check_constraint="proficiency IN (1, 2, 3)")

    mentor = relationship("User", back_populates="mentor_skills")
    skill = relationship("Skill")


# MenteeSkill model
class MenteeSkill(Base):
    __tablename__ = "mentee_skill"

    # id = Column(Integer, primary_key=True, index=True)
    mentee_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skill.id"), primary_key=True)

    mentee = relationship("User", back_populates="mentee_skills")
    skill = relationship("Skill")

# Domain model
class Domain(Base):
    __tablename__ = "domain"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    domain_skills = relationship("DomainSkill", back_populates="domain")
    roadmaps = relationship("Roadmap", back_populates="domain")

# DomainSkill model
class DomainSkill(Base):
    __tablename__ = "domain_skill"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domain.id"))
    skill_id = Column(Integer, ForeignKey("skill.id"))

    #relationship with domain and skill
    domain = relationship("Domain", back_populates="domain_skills")
    skill = relationship("Skill", back_populates="domain_skills")
    

# Roadmap model
class Roadmap(Base):
    __tablename__ = "roadmap"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domain.id"))

    #relationship with domain
    domain = relationship("Domain", back_populates="roadmaps")

    # Relationship with Topic and MentorMentee
    topics = relationship("Topic", back_populates="roadmap")
    mentor_mentees = relationship("MentorMentee", back_populates="roadmap")

# Topic model
class Topic(Base):
    __tablename__ = "topic"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmap.id"))
    name = Column(String, nullable=False)
    status = Column(String, nullable=False, check_constraint="status IN ('assigned', 'marked', 'completed')")
    #relationship with roadmap
    roadmap = relationship("Roadmap", back_populates="topics")

# MentorMentee model
class MentorMentee(Base):
    __tablename__ = "mentor_mentee"

    
    mentor_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    mentee_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmap.id"), primary_key=True)
    status = Column(String, nullable=False, check_constraint="status IN ('approved', 'pending', 'not approved')")
    comment = Column(String, nullable=True)
    
    #relationship with roadmap
    roadmap = relationship("Roadmap", back_populates="mentor_mentees")

 
#relationship with user
# Feedback model
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user.id"))
    receiver_id = Column(Integer, ForeignKey("user.id"))
    feedback = Column(Text, nullable=False)
    sender_role = Column(String, nullable=False, check_constraint="sender_role IN ('mentor', 'mentee')")