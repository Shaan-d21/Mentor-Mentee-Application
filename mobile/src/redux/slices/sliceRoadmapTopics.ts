// src/redux/slices/sliceRoadmapTopics.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getRoadmapTopics } from "../../services/apiRoadmap/apiGetRoadmap";


interface RoadmapState {
  roadmapName: string;
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  roadmapName: '',
  loading: false,
  error: null,
};

export const fetchRoadmapTopics = createAsyncThunk(
  "roadmap/fetchRoadmapTopics",
  async ({ mentorId, domainId }: { mentorId: number; domainId: number }, { rejectWithValue }) => {
    try {
      const response = await getRoadmapTopics(mentorId, domainId);
      if (response && response.roadmap_name) {
        return response.roadmap_name;
      } else {
        return rejectWithValue("Failed to fetch roadmap topics: Invalid response format");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch roadmap topics");
    }
  }
);

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmapTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmapTopics.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.roadmapName = action.payload;
      })
      .addCase(fetchRoadmapTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default roadmapSlice.reducer;