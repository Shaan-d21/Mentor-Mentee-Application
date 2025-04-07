# roadmap_recommendation.py
import os     
import google.generativeai as genai
from typing import List
from dotenv import load_dotenv
from config import GOOGLE_API_KEY, GEMINI_MODEL_NAME 

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL_NAME)

def generate_roadmap_content(domain_name: str) -> List[str]:
    """
    Generate a learning roadmap for a given domain using Gemini AI
    
    Args:
        domain_name: The name of the domain to generate a roadmap for
        
    Returns:
        List of topics in sequential order (from basic to advanced)
    """
    prompt = f"""
    Create a detailed learning roadmap for a person in the {domain_name} field.
    The roadmap should include a list of topics to learn in sequential order (from basic to advanced).
    
    Provide the output as a simple list of topics, one per line.
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text
        
        # Parse the content as a list of topics
        topics = [line.strip() for line in content.split('\n') if line.strip()]
        return topics
    except Exception as e:
        raise Exception(f"Error generating roadmap: {str(e)}")