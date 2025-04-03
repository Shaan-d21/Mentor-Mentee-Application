from fastapi import Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import cast, Integer
from sqlalchemy.sql import select, func
from typing import Annotated
from database import SessionLocal
from models import User, MentorMentee, MentorSkill, Skill

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_session = Annotated[Session, Depends(get_db)]

def get_available_mentors(db=db_session):

    # subquery = (
    #     select(MentorMentee_rel.mentor_id)
    #     .group_by(MentorMentee_rel.mentor_id)
    #     .having(func.sum(cast(MentorMentee_rel.approved, Integer)) < 3)
    # ).subquery()

    # query = (
    #     select(
    #         User.id.label("id"),
    #         func.json_object_agg(
    #             func.coalesce(Skill.name, 'Unknown'), 
    #             func.coalesce(MentorSkill.proficiency, 1)
    #         ).filter(Skill.name.isnot(None)).label("skills"),
    #         User.name.label("name")
    #     )
    #     #.outerjoin(MentorMentee_rel, User.id == MentorMentee_rel.mentor_id)
    #     .outerjoin(MentorSkill, User.id == MentorSkill.mentor_id)
    #     .outerjoin(Skill, MentorSkill.skill_id == Skill.id)
    #     # .where(User.id.in_(subquery))
    #     .group_by(User.id)
    # )
    # m_list = db.query(User).filter(User.role == 'mentor').filter(User.id == MentorSkill.mentor_id).all()
    m_list = (
      db.query(User)
      .filter(User.role == 'mentor')
      .options(joinedload(User.mentor_skills))  # Assuming a relationship exists
      .all()
    )
    mentors_with_skills = [
        {
            "id": mentor.id,
            "name": mentor.name,
            "skills": [{"skill": skill.skill.name, "proficiency": skill.proficiency} for skill in mentor.mentor_skills]
        }
        for mentor in m_list
    ]

    print(mentors_with_skills)
    # result = db.execute(query).fetchall()

    return mentors_with_skills

# with SessionLocal() as db:
#     available_mentors = get_available_mentors(db)
#     print(available_mentors)




"""
The funtion returns all the available Mentor list as a list of dictionary
[
  {
    "id": 101,
    "skills": {
      "skills_1": "proficiency_1",
      "skills_2": "proficiency_2"
    }
  },
  {
    "id": 107,
    "skills": {
      "skills_1": "proficiency_1",
      "skills_2": "proficiency_2",
      "skills_3": "proficiency_3"
    }
  }
]
"""