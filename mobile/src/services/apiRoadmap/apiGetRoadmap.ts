import axios from 'axios';

interface RoadmapResponse {
  status_code: number;
  message: string;
  roadmap_name: string;
}

const API_BASE_URL = process.env.API_URL;

export const getRoadmapTopics = async (mentorId: number, domainId: number): Promise<RoadmapResponse> => {
    try {
        const response = await axios.post<RoadmapResponse>(
          `https://7e49-160-250-150-14.ngrok-free.app/mentee/roadmap-topics`,
          { // Request body
            mentor_id: mentorId,
            domain_id: domainId
          },
          {
            headers: {
              'accept': 'application/json',
              'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTcmFqYW4iLCJpZCI6MSwicm9sZSI6Im1lbnRlZSIsImV4cCI6MTc0NTA2Njg1MX0.6AGeMKuHzv16JRL5h-1A1HzRyEqTv0zz8FCbUrC6OnU',
              'Content-Type': 'application/json', // Add Content-Type header
            },
          }
        );
        console.log(response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching roadmap topics:", error);
        throw error;
      }
};