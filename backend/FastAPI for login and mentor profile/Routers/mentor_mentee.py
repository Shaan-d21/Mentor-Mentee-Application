from sentence_transformers import SentenceTransformer, util
import numpy as np
from .get_mentor import get_available_mentors
from database import SessionLocal 
from fastapi import HTTPException

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize the model



model = SentenceTransformer('all-MiniLM-L6-v2')
def matching(domain_choice: str):
        domain_skills = {
            "Programming Languages": ["Python", "Java", "JavaScript", "C++"],
            "Database & Backend": ["SQL", "Node JS", "SpringBoot", "Java"],
            "Cloud Computing": ["AWS", "GCP"],
            "DevOps & Deployment": ["Docker"],
            "Artificial Intelligence & Machine Learning": ["Machine Learning", "Deep Learning", "NLP", "TensorFlow", "LangChain", "GenAI", "Python"],
            "Data Science & Analytics": ["Data Analysis", "Big Data", "Python"],
            "Software Development": ["Data Structure", "Problem Solving", "Java", "C++", "SQL", "Python"],
            "Project & Team Management": ["Project Management", "Leadership", "Time Management"],
            "Soft Skills": ["Communication", "Public Speaking", "Critical Thinking", "Teamwork"],
            "Web Development": ["HTML", "CSS", "JavaScript"]
        }
        # try:
        mentee_skills = domain_skills.get(domain_choice, [])
        if not mentee_skills:
            return {'status': 400, 'message': 'Invalid domain selection. No skills found.', 'mentors': []}

        mentee_embedding = model.encode(', '.join(mentee_skills))#.astype(np.float32)
        with SessionLocal() as db:
            available_mentors = get_available_mentors(db)
        print(available_mentors)
        mentor_scores = {}
        mentor_names = {}

        for mentor in available_mentors:
            if not mentor.get('skills'):
                continue

            skill_names = [skill_dict['skill'] for skill_dict in mentor['skills']]
            skill_proficiencies = np.array([skill_dict['proficiency'] for skill_dict in mentor['skills']])

            
            # skill_names = list(mentor['skills'].keys())
            # skill_proficiencies = np.array(list(mentor['skills'].values()), dtype=np.float32)
            if skill_proficiencies.size == 0:
                continue
            
            skill_embeddings = np.array([model.encode(skill) for skill in skill_names])
            if skill_embeddings.size == 0:
                continue
            # skill_names = list(mentor['skills'].keys())
            # skill_proficiencies = np.array(list(mentor['skills'].values()))
            # skill_embeddings = np.array([model.encode(skill) for skill in skill_names])

            # if skill_proficiencies.size == 0 or skill_embeddings.size == 0:
            #     continue

            normalized_proficiency = (skill_proficiencies - 1) / (3 - 1)
            normalized_proficiency = normalized_proficiency.reshape(-1, 1)
            weighted_embeddings = skill_embeddings * normalized_proficiency
            weighted_avg_embedding = np.sum(weighted_embeddings, axis=0) / (np.sum(normalized_proficiency)+0.000001)
            weighted_avg_embedding = weighted_avg_embedding.astype(np.float32)

            similarity = util.cos_sim(mentee_embedding, weighted_avg_embedding).item()
            average_proficiency = np.mean(normalized_proficiency)
            weighted_similarity = similarity * average_proficiency

            mentor_scores[mentor["id"]] = weighted_similarity
            mentor_names[mentor["id"]] = mentor["name"]

        sorted_mentors = sorted(mentor_scores.items(), key=lambda x: x[1], reverse=True)
        sorted_mentors_with_names = [{'id': mentor_id, 'name': mentor_names[mentor_id], 'score': mentor_scores[mentor_id]} for mentor_id, _ in sorted_mentors]

        return {'status_code': 200, 'Message': 'Operation Successful', 'mentors': sorted_mentors_with_names}
    # except:
    #     raise HTTPException(status_code= 404, detail='Operation Un-successful')