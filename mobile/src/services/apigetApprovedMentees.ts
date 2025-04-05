import axios from "axios";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const apiGetApprovedMentees = async () => {
  const api = axios.create({
    baseURL: process.env.API_URL, // Ensure this is set in your environment variables
    headers: {
      accept: "application/json",
    //   token: storage.getString("token"), // Ensure the token is stored in MMKV
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBIiwiaWQiOjksInJvbGUiOiJtZW50b3IiLCJleHAiOjE3NDUwNjgxNTN9.L4eSRmCOLuqOXQGzbhD1XcO07MH0UDykV1OespKNOfw"
    },
  });

  try {
    const response = await api.get("/mentor/get-approved-mentee");
    console.log("Response from get-approved-mentee:", response);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error fetching approved mentees:", error);
    return { error: "Request failed", details: error };
  }
};

export const  apiPostGenerateRoadMap=async (domain:string,menteeId:string)=>{
  const api = axios.create({
    baseURL: "https://7e49-160-250-150-14.ngrok-free.app/",
        headers: {
      accept: "application/json",
    //   token: storage.getString("token"), // Ensure the token is stored in MMKV
    token: " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBIiwiaWQiOjksInJvbGUiOiJtZW50b3IiLCJleHAiOjE3NDUwNjgxNTN9.L4eSRmCOLuqOXQGzbhD1XcO07MH0UDykV1OespKNOfw"
    },
  });

  try {
    const response = await api.post("/mentor/generate-roadmap",{
      domain_id: 1,
      mentee_id: menteeId,
    });
    console.log("Response from get-approved-mentee:", response);

    if (response.status === 200) {

      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error fetching approved mentees:", error);
    return { error: "Request failed", details: error };
  }
  
};

export const apiPostAssignRoadmap = async (menteeId:string,domainId:string,roadmapId:string) => {
  const api = axios.create({
    baseURL: process.env.API_URL, // Ensure this is set in your environment variables
    headers: {
      accept: "application/json",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBIiwiaWQiOjksInJvbGUiOiJtZW50b3IiLCJleHAiOjE3NDUwNjgxNTN9.L4eSRmCOLuqOXQGzbhD1XcO07MH0UDykV1OespKNOfw",
    },
  });

  try {
    const data = {
      "mentee_id": menteeId,
      "domain_id": domainId,
      "roadmap_id": roadmapId,
    }
    const response = await api.post("/mentor/assign-roadmap", data);
    console.log("Response from assign-roadmap:", response);

    if (response.status === 200) {
      return 1;
    } else {
      console.error("Unexpected response status:", response.status);
      return 0;
    }
  } catch (error: any) {
    console.error("Error assigning roadmap:", error);
    return 0;
  }
};