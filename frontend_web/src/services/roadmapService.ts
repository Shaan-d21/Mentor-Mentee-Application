import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL;

export interface RoadmapRequest {
  domain_id: string;
  mentee_id: string;
}

export interface RoadmapResponse {
  roadmap_name: string;
  roadmap_id: number;
  roadmap_explanation: string;
  topics: any[];
}

export const generateRoadmap = async (request: RoadmapRequest): Promise<RoadmapResponse> => {
  try {
    const response = await axios.post(`${API_URL}/roadmaps/generate`, request, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Token': localStorage.getItem('accessToken') || ''
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Access denied for roadmap generation');
          break;
        case 404:
          console.error('Roadmap generation endpoint not found');
          break;
        case 405:
          console.error('Method not allowed for roadmap generation');
          break;
        case 500:
          console.error('Server error during roadmap generation');
          break;
        default:
          console.error('Error generating roadmap:', error.response.status);
      }
    } else if (error.request) {
      console.error('No response received from roadmap generation service');
    } else {
      console.error('Error setting up roadmap generation request:', error.message);
    }
    throw error;
  }
}; 