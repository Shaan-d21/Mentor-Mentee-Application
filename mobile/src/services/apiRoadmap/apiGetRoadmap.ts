import axios from 'axios';
import { MMKV } from "react-native-mmkv";
interface RoadmapResponse {
  status_code: number;
  message: string;
  roadmap_name: string;
}

// const API_BASE_URL = "http://181.214.44.15:8080/";

export const getRoadmapTopics = async (mentorId: number, domainId: number): Promise<RoadmapResponse> => {
  const storage= new MMKV();

    try {
        const response = await axios.post<RoadmapResponse>(
          `${process.env.API_URL}mentee/roadmap-topics`,
          { // Request body
            mentor_id: mentorId,
            domain_id: domainId
          },
          {
            headers: {
              'accept': 'application/json',
              "token": storage.getString("token"),
              'Content-Type': 'application/json', 
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