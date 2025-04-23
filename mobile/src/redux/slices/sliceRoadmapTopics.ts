import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetTopicsOnMenteeScreen, apiMarkTopicAsDone } from "../../services/apiRoadmap/apiGetRoadmap"; 
import { RoadmapResponse } from "../../types/RoadmapTypes";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" }

// State of the redux
interface State {

  roadmap: RoadmapResponse | null; // Changed from RoadmapResponse to RoadmapTopic[]
 status: currentStatus;
  refresh: boolean;
}

const initialState: State = {

  roadmap: null,
  refresh: false,
  status: currentStatus.idle,
};

// Async thunk to fetch the roadmap data
export const fetchRoadmap = createAsyncThunk<RoadmapResponse, number, { rejectValue: string }>(
  "menteeRoadmap/fetchRoadmap",
  async (roadmapId, { rejectWithValue }) => { 
    const response = await apiGetTopicsOnMenteeScreen(roadmapId);
    
    if (!response) {
      return rejectWithValue("No data returned from API");
    }
    console.log("Fetched roadmap data:", response.topics);
    return response;
  }
);

// Async thunk to mark a topic as done
export const markTopicAsDone = createAsyncThunk<number, { topicId: number }, { rejectValue: string }>(
  "menteeRoadmap/markTopicAsDone",
  async ({ topicId }, { rejectWithValue }) => {
    try {
      await apiMarkTopicAsDone(topicId);
      console.log("Marked topic as done:", topicId);
      return topicId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to mark topic as done");
    }
  }
);

const sliceRoadmapTopics = createSlice({
  name: "menteeRoadmap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        console.log("Roadmap data:", action.payload);
        state.status = currentStatus.success;
        const processedPayload = {
          ...action.payload,
          topics: action.payload.topics.map(topic => ({
            ...topic,
            // Set default values for potentially null fields
            topic_duration_days: topic.topic_duration_days ?? 0,
            subtopics: topic.subtopics ?? [],
          }))
        };
        
        state.roadmap = processedPayload;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        console.error("Failed to fetch roadmap:", action.payload);
      })
      .addCase(markTopicAsDone.pending, (state) => {
        // No optimistic updates needed here now
      })
      .addCase(markTopicAsDone.fulfilled, (state, action) => {
        // Update the topic status in the single array
        state.refresh = !state.refresh; // Toggle refresh to trigger UI updates
  
      })
      .addCase(markTopicAsDone.rejected, (state, action) => {
        // If marking failed, you might want to handle error state here
        console.error("Failed to mark topic as done:", action.payload);
      });
  },
});

// Selector functions to filter topics by status - with null checks added
// export const selectAssignedTopics = (state: { menteeRoadmap: State }) => 
//   state.menteeRoadmap.roadmapTopics ? 
//     state.menteeRoadmap.roadmapTopics.filter(topic => topic.topic_status === "assigned") : 
//     [];

// export const selectMarkedTopics = (state: { menteeRoadmap: State }) => 
//   state.menteeRoadmap.roadmapTopics ? 
//     state.menteeRoadmap.roadmapTopics.filter(topic => topic.topic_status === "marked") : 
//     [];

// export const selectCompletedTopics = (state: { menteeRoadmap: State }) => 
//   state.menteeRoadmap.roadmapTopics ? 
//     state.menteeRoadmap.roadmapTopics.filter(topic => topic.topic_status === "completed") : 
//     [];

// export const selectReassignedTopics = (state: { menteeRoadmap: State }) => 
//   state.menteeRoadmap.roadmapTopics ? 
//     state.menteeRoadmap.roadmapTopics.filter(topic => topic.topic_status === "reassigned") : 
//     [];

export default sliceRoadmapTopics.reducer;