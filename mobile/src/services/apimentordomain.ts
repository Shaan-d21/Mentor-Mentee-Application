import axios from 'axios';

// if using separate file
export interface Mentor {
    name: string;
    id: number;
    mail: string;
    designation: string;
    domain: string;
    score: number;
    reason: string;
  }
  export interface MentorResponse {
    domain_mentors: Mentor[];
    other_domain_mentors: Mentor[];
  }

const fetchMentors = async () => {
  try {
    const response = await axios.get<MentorResponse>('https://1193-160-250-150-14.ngrok-free.app/predict/', {
      params: {
        d: 'DevOps & Deployment',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    console.log('Domain Mentors:', data.domain_mentors);
    console.log('Other Domain Mentors:', data.other_domain_mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
  }
};
fetchMentors();

export default fetchMentors;





