import { ApprovedMentor } from "../../redux/slices/sliceMenteeRoadmap";
import axios from 'axios';
import { MMKV } from "react-native-mmkv";
interface ApiResponse {
  data: {
    message: string;
    object: ApprovedMentor[];
    status_code: number;
  };
}
// const API_BASE_URL = process.env.API_URL; // Ensure API_URL is set in your environment
// const API_BASE_URL = "http://181.214.44.15:8080/";
export const getApprovedMentors = async (): Promise<ApiResponse[]> => {
  const storage= new MMKV();
  try {
    const response = await axios.get<ApiResponse[]>(`http://181.214.44.15:8080/mentee/mentor-roadmap-details`, {
      headers: {
        'accept': 'application/json',
        'Token': storage.getString("token")       },
      
    });
    console.log(response.data);
    return response.data;
  
  } catch (error: any) {
    console.error("Error fetching mentor roadmap details:", error);
    throw error; // Re-throw the error so the calling function can handle it
  }
};