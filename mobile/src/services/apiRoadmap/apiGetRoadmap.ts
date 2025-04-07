import axios from 'axios';
import { MMKV } from "react-native-mmkv";
interface RoadmapResponse {
  status_code: number;
  message: string;
  roadmap_name: string;
}

const API_BASE_URL = process.env.API_URL;

export const getRoadmapTopics = async (mentorId: number, domainId: number): Promise<RoadmapResponse> => {
  const storage= new MMKV();

    try {
        const response = await axios.post<RoadmapResponse>(
          `mentee/roadmap-topics`,
          { // Request body
            mentor_id: mentorId,
            domain_id: domainId
          },
          {
            headers: {
              'accept': 'application/json',
              "token": storage.getString("token"),
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