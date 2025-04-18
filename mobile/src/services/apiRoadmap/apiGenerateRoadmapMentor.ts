
import axios from "axios";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV();

export const apiGetApprovedMentees = async () => {
  const api = axios.create({
    // baseURL: "http://181.214.44.15:8080/", // Ensure this is set in your environment variables
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      token: storage.getString("token"), // Ensure the token is stored in MMKV
      // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg"
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
export const apiPostGenerateRoadMap = async (domainId: string, menteeId: string) => {
  const api = axios.create({
    baseURL: "https://mm-ai.shaandewang.publicvm.com/",
    headers: {
      accept: "application/json",
      'Content-Type': 'application/json',
    },
  });
  try {
    const response = await api.post("roadmaps/generate/", {
      domain_id: domainId,
      mentee_id: menteeId,
    });
    console.log("Response from Generate Roadmap:", response);
    if (response.status === 200) {
      return response;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error fetching approved mentees:", error);
    return { error: "Request failed", details: error };
  }
};
export const apiPostAssignRoadmap = async (menteeId: string, domainId: string, roadmapId: string) => {
  const api = axios.create({
    baseURL: process.env.API_URL, // Ensure this is set in your environment variables
    headers: {
      accept: "application/json",
      token: storage.getString("token"), // Ensure the token is stored in MMKV
      // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWxndW5pIiwiaWQiOjQzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjM2NjYyfQ.CBXntNG8fr6kPsU5dvWhQb-ELU1Rjo6rZSOrnBUwRqg",
    },
  });
  try {
    const data = {
      "mentee_id": menteeId,
      "domain_id": domainId,
      "roadmap_id": roadmapId,
    }
    const response = await api.post("mentor/assign-roadmap", data);
    console.log("Response from assign-roadmap:", response);
    // return 1;
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


export const apiModifyRoadmapTopic = async (
  topicId: number,
  topicName: string,
  description: string,
  subtopics: string[],
  reasoning: string
) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      'Content-Type': 'application/json',
      token: storage.getString("token"),
    },
  });

  try {
    const response = await api.put("roadmap/modify_topic", {
      topic_id: topicId,
      topic_name: topicName,
      description: description,
      subtopics: subtopics,
      reasoning: reasoning
    });
    
    console.log("Response from modify topic:", response);
    
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error modifying topic:", error);
    return { error: "Request failed", details: error };
  }
};



export const apiAddRoadmapTopic = async (
  roadmapId: number,
  topicName: string,
  description: string,
  subtopics: string[],
  reasoning: string
) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      'Content-Type': 'application/json',
      token: storage.getString("token"),
    },
  });

  try {
    const response = await api.post("roadmap/add_topic", {
      roadmap_id: roadmapId,
      topic_name: topicName,
      description: description,
      subtopics: subtopics,
      reasoning: reasoning
    });
    
    console.log("Response from add topic:", response);
    
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return { error: "Unexpected response from server", status: response.status };
    }
  } catch (error: any) {
    console.error("Error adding topic:", error);
    return { error: "Request failed", details: error };
  }
};


// for delete

export const apiDeleteTopic = async (topicId: number) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      token: storage.getString("token"),
    },
  });

  try {
    const response = await api.delete(`/roadmaps/delete-topic/${topicId}`);
    console.log("Response from delete-topic:", response);
    
    if (response.status === 200) {
      return { success: true };
    } else {
      console.error("Unexpected response status:", response.status);
      return { success: false, status: response.status };
    }
  } catch (error: any) {
    console.error("Error deleting topic:", error);
    return { success: false, error };
  }
};
