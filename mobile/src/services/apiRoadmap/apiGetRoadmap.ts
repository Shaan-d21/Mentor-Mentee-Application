import axios from 'axios';
import { MMKV } from "react-native-mmkv";
import { RoadmapResponse } from '../../types/ViewRoadmapTypes';

// const API_BASE_URL = "http://181.214.44.15:8080/";
const storage= new MMKV();

export const apiGetTopicsOnMenteeScreen = async (roadmapId:number): Promise<RoadmapResponse> => {
 

    try {
        const response = await axios.get<RoadmapResponse>(
          `${process.env.API_URL}mentee/roadmap-topics/${roadmapId}`,
          
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

export const apiMarkTopicAsDone = async (topicId: number): Promise<void> => {
  try {
    const response = await axios.put(
      `${process.env.API_URL}progress/mark_done`,
      {
        topic_id: topicId,
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
  } catch (error: any) {
    console.error("Error marking topic as done:", error);
    throw error;
  }
}