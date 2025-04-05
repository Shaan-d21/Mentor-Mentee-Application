import { ApprovedMentor } from "../../redux/slices/sliceMenteeRoadmap";
import axios from 'axios';
interface ApiResponse {
  data: {
    message: string;
    object: ApprovedMentor[];
    status_code: number;
  };
}
// const API_BASE_URL = process.env.API_URL; // Ensure API_URL is set in your environment
const API_BASE_URL = "https://7e49-160-250-150-14.ngrok-free.app"
export const getApprovedMentors = async (): Promise<ApiResponse[]> => {
  try {
    const response = await axios.get<ApiResponse[]>(`https://7e49-160-250-150-14.ngrok-free.app/mentee/mentor-roadmap-details`, {
      headers: {
        'accept': 'application/json',
        'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTcmFqYW4iLCJpZCI6MSwicm9sZSI6Im1lbnRlZSIsImV4cCI6MTc0NTA2Njg1MX0.6AGeMKuHzv16JRL5h-1A1HzRyEqTv0zz8FCbUrC6OnU",
      },
      
    });
    console.log(response.data);
    return response.data;
  
  } catch (error: any) {
    console.error("Error fetching mentor roadmap details:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};