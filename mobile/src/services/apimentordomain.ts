import axios from 'axios';

// Interface definitions
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

// Function to fetch mentors based on the selected domain
const fetchMentors = async (domain: string): Promise<MentorResponse | null> => {
  
  try {
    const response = await axios.get<MentorResponse>(
      'https://db79-160-250-150-14.ngrok-free.app/docs#/default/predict_predict__get',
      {
        params: {
          d: domain, 
        },
        headers: {
          accept: 'application/json',
        },
      }
    );

    const data = response.data;
    console.log('Domain Mentors:', data.domain_mentors);
    console.log('Other Domain Mentors:', data.other_domain_mentors);





    
    return data; // Return the fetched data
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return null; // Return null in case of an error
  }
};

export default fetchMentors;