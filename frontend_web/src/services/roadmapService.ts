import axios from 'axios';

const API_URL = 'http://181.214.44.15:8080';

export interface RoadmapRequest {
    domain_id: number;
    mentee_id: number;
}

export interface RoadmapResponse {
    roadmap_name: string;
    roadmap_id: number;
}

export const generateRoadmap = async (request: RoadmapRequest): Promise<RoadmapResponse> => {
    try {
        const response = await axios.post(`${API_URL}/roadmaps/generate`, request);
        return response.data;
    } catch (error) {
        console.error('Error generating roadmap:', error);
        throw error;
    }
}; 