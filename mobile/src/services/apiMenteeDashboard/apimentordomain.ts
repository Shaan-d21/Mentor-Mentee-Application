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
export const fetchMentors = async (domain: string) => {
  try {
    console.log('apimentordomain: Fetching mentors for domain:', domain);
    const response = await axios.get<MentorResponse>(
      'https://db79-160-250-150-14.ngrok-free.app/predict/',
      {
        params: { d: domain },
        headers: {
          accept: 'application/json',
        },
      }
    );
    const data = response.data;
    console.log(`apimentordomain: Response from server:`, JSON.stringify(data));
    // console.log('apimentordomain: Domain Mentors:', data.domain_mentors);
    console.log('Other Domain Mentors:', data.other_domain_mentors);
    return data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return null;
  }
};

export default fetchMentors;