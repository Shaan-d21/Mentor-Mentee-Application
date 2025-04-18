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

   
  },
});
export const { initialStateMentorRoadmap } = mentorRoadmapSlice.actions;
export default mentorRoadmapSlice.reducer;