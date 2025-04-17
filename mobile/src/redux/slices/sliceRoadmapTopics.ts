import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetTopicsOnMenteeScreen, apiMarkTopicAsDone } from "../../services/apiRoadmap/apiGetRoadmap"; // Replace with your actual API functions
import { RoadmapTopic,RoadmapResponse } from "../../types/ViewRoadmapTypes";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" }

// State of the redux
interface State {
  roadMapId: number | null;
  roadmapExplanation: string ;
  assignedTopics: RoadmapTopic[];
  markedTopics: RoadmapTopic[];
  completedTopics: RoadmapTopic[];
  status: currentStatus;
}

const initialState: State = {
  roadMapId: null,
  roadmapExplanation: '',
  assignedTopics: [],
  markedTopics: [],
  completedTopics: [],
  status: currentStatus.idle,
};

// API response

// Async thunk to fetch the roadmap data
export const fetchRoadmap = createAsyncThunk<RoadmapResponse, number, { rejectValue: string }>(
  "menteeRoadmap/fetchRoadmap",
  async (roadmapId, { rejectWithValue }) => { 
    const response = await apiGetTopicsOnMenteeScreen(roadmapId);
    console.log(response);
    // Replace with your actual API function
    if (!response) {
      return rejectWithValue("No data returned from API");
    }
    console.log("Fetched roadmap data:", response.topic);
    return {
      topic: response.topic,
      roadmap_explanation: response.roadmap_explanation,
      roadmap_id: response.roadmap_id,
      status_code: response.status_code, // make sure this exists
      message: response.message,
    };
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
        state.assignedTopics = action.payload.topic.filter(topic => topic.topic_status === "assigned");
        state.completedTopics = action.payload.topic.filter(topic => topic.topic_status === "completed");
        state.markedTopics = action.payload.topic.filter(topic => topic.topic_status === "marked");
        state.roadMapId = action.payload.roadmap_id;
        state.roadmapExplanation = action.payload.roadmap_explanation;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        console.error("Failed to fetch roadmap:", action.payload);
      })
      .addCase(markTopicAsDone.pending, (state, action) => {
        // Optimistically update the UI
        const topicId = action.meta.arg.topicId;
        state.assignedTopics = state.assignedTopics.filter(topic => topic.topic_id !== topicId);
        state.markedTopics.push(state.assignedTopics.find(topic => topic.topic_id === topicId)!);
      })
      .addCase(markTopicAsDone.fulfilled, (state, action) => {
        // Update the state after successfully marking the topic as done
        const topicId = action.payload;
        state.markedTopics = state.markedTopics.filter(topic => topic.topic_id !== topicId);
        state.completedTopics.push(state.markedTopics.find(topic => topic.topic_id === topicId)!);
      })
      .addCase(markTopicAsDone.rejected, (state, action) => {
        // If marking as done failed, revert the optimistic update
        const topicId = action.meta.arg.topicId;
        state.markedTopics = state.markedTopics.filter(topic => topic.topic_id !== topicId);
        state.assignedTopics.push(state.markedTopics.find(topic => topic.topic_id === topicId)!);
        console.error("Failed to mark topic as done:", action.payload);
      });
  },
});

export default sliceRoadmapTopics.reducer;