import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetApprovedMentees, apiPostAssignRoadmap, apiPostGenerateRoadMap, apiModifyRoadmapTopic, apiAddRoadmapTopic } from "../../services/apiRoadmap/apiGenerateRoadmapMentor";
import { RoadmapResponse, roadmapResponseFromJson, RoadmapTopic } from "../../types/RoadmapTypes";

enum currentStatus {
  idle = "idle",
  loading = "loading",
  success = "success",
  failed = "failed",
}

interface Mentee {
  id: number;
  name: string;
  domain_id: string;
  roadmapId?: string;
  domain_name: string;
  roadmap_id: number;
}

interface MentorRoadmapState {
  mentees: Mentee[];
  roadmap: RoadmapResponse | null;
  roadmapId: string | null;
  status: currentStatus;
  error: string | null;
  assignStatus: 0|1 | null;
}

const initialState: MentorRoadmapState = {
  mentees: [],
  roadmap: null,
  roadmapId: null,
  status: currentStatus.idle,
  error: null,
  assignStatus: null,
};

// Async thunk to fetch approved mentees
export const fetchApprovedMentees = createAsyncThunk("mentorRoadmap/fetchMentees", async () => {
  try {
    const response = await apiGetApprovedMentees();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.object.map((item: any) => ({
      id: item.id,
      name: item.name,
      domain_id: item.domain_id,
      domain_name: item.domain_name,
    }));
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch mentees");
  }
});

// Async thunk to generate a roadmap
export const generateRoadmap = createAsyncThunk(
  "mentorRoadmap/generateRoadmap", async ({domainId,id}:{domainId: string,id:string}) => {
    try {
      const roadmaps = await apiPostGenerateRoadMap(domainId,id); 
      console.log("generateRoadmap", roadmaps);
      if(roadmaps.status!== 200){
        throw new Error(roadmaps.toString() || "Failed to generate roadmap");
      }
      return roadmaps;
    } catch (error: any) {
      throw new Error(error.message.toString() || "Failed to generate roadmap");
    }
  }
);

// New thunk for editing a topic
export const editRoadmapTopic = createAsyncThunk(
  "mentorRoadmap/editTopic",
  async (topic: RoadmapTopic, { rejectWithValue }) => {
    try {
      const response = await apiModifyRoadmapTopic(
        topic.topic_id,
        topic.name,
        topic.description,
        topic.subtopics,
        topic.importance
      );
      
      if (response.error) {
        return rejectWithValue(response.error);
      }
      
      return topic; // Return the updated topic
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update topic");
    }
  }
);

// New thunk for adding a topic
export const addRoadmapTopic = createAsyncThunk(
  "mentorRoadmap/addTopic",
  async ({roadmapId, topicData}: {roadmapId: number, topicData: RoadmapTopic}, { rejectWithValue }) => {
    try {
      const response = await apiAddRoadmapTopic(
        roadmapId,
        topicData.name,
        topicData.description,
        topicData.subtopics,
        topicData.importance
      );
      
      if (response.error) {
        return rejectWithValue(response.error);
      }
      
      // Handle the nested topic structure in the response
      if (response.topic) {
        // Make sure subtopics is properly handled as an array
        const subtopics = Array.isArray(response.topic.subtopics) 
          ? response.topic.subtopics 
          : typeof response.topic.subtopics === 'string'
            ? [response.topic.subtopics] // Convert single string to array
            : []; // Default to empty array if undefined
            
        return {
          ...response.topic,
          topic_id: response.topic.id,
          // Ensure subtopics is always an array
          subtopics: subtopics,
          importance: topicData.importance // Preserve this if not returned by API
        };
      } else {
        // Fallback for unexpected response format
        console.warn("Unexpected API response format:", response);
        const responseData = response.object || response.data || {};
        
        // Ensure subtopics is always an array
        const subtopics = Array.isArray(responseData.subtopics) 
          ? responseData.subtopics 
          : typeof responseData.subtopics === 'string'
            ? [responseData.subtopics] // Convert single string to array
            : topicData.subtopics || []; // Use the original subtopics or default to empty array
            
        return {
          ...responseData,
          topic_id: responseData.id || `temp-${Date.now()}`,
          subtopics: subtopics
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add topic");
    }
  }
);
export const assignRoadmap = createAsyncThunk("mentorRoadmap/assignRoadmap", async ({menteeId,domainId,roadmapId}:{menteeId:string,domainId:string,roadmapId:string}) => {
  console.log("Assigning roadmap with ID:", roadmapId);

  try {
    console.log("Assigning roadmap with ID:", roadmapId);
    const response = await apiPostAssignRoadmap(menteeId,domainId,roadmapId); 
    console.log("Response from assign-roadmap:", response);
  if(response == 1){
    return response;
  }
  else{
    throw new Error("Failed to assign roadmap");}
  }
  catch (error: any) {
    throw new Error(error.message || "Failed to assign roadmap");
  }
}
);

const mentorRoadmapSlice = createSlice({
  name: "mentorRoadmap",
  initialState,
  reducers: {
    initialStateMentorRoadmap (state)  {
      state.mentees = [];
      state.roadmap = null;
      state.roadmapId = null;
      state.status = currentStatus.idle;
      state.error = null;
      state.assignStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch approved mentees
      .addCase(fetchApprovedMentees.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(fetchApprovedMentees.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.mentees = action.payload; // Store only id and name
      })
      .addCase(fetchApprovedMentees.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to fetch mentees";
      })

      // Generate roadmap
      .addCase(generateRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        console.log("Roadmap data:", action.payload);
        // @ts-ignore
        const roadmapData = action.payload.data;
        console.log("Roadmap data:", roadmapData);
        state.status = currentStatus.success;
        state.error = null;
        console.log("Roadmap generated:", action.payload);
        // state.roadmapId = action.payload.roadmap_id;
        state.roadmapId = roadmapData.roadmap_id;

      // state.roadmap= splitByNewLine(action.payload.roadmap_name);
        state.roadmap= roadmapResponseFromJson(roadmapData);
        console.log("Roadmap ID:", state.roadmapId);
        console.log("Roadmap name:", roadmapData.roadmap_name);
        
    console.log("Roadmap topics:", state.roadmap);
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to generate roadmap";
      })
      
      // Handle topic editing
      .addCase(editRoadmapTopic.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(editRoadmapTopic.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.error = null;

        if (state.roadmap) {
          // Find and replace the edited topic
          const updatedTopics = state.roadmap.topics.map(topic => 
            topic.topic_id === action.payload.topic_id ? action.payload : topic
          );
          state.roadmap = {
            ...state.roadmap,
            topics: updatedTopics
          };
        }
      })
      .addCase(editRoadmapTopic.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.payload as string || "Failed to update topic";
      })

      // Handle topic addition
      .addCase(addRoadmapTopic.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(addRoadmapTopic.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.error = null;

        if (state.roadmap) {
          // Add the new topic to the list
          state.roadmap = {
            ...state.roadmap,
            topics: [...state.roadmap.topics, action.payload]
          };
        }
      })
      .addCase(addRoadmapTopic.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.payload as string || "Failed to add topic";
      })

      .addCase(assignRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(assignRoadmap.fulfilled, (state, action) => {
        state.status = currentStatus.idle;
        state.roadmap = null;
        state.roadmapId = null;
        state.error = null;
        state.assignStatus = action.payload == 1 ? 1 : 0;
        console.log("Roadmap assigned:", action.payload);

      })
      .addCase(assignRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to assign roadmap";
      });
  },
});
export const { initialStateMentorRoadmap } = mentorRoadmapSlice.actions;
export default mentorRoadmapSlice.reducer;