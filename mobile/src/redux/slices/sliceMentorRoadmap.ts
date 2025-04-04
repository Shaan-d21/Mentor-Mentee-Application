import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetApprovedMentees, apiPostGenerateRoadMap } from "../../services/apigetApprovedMentees";

enum currentStatus {
  idle = "idle",
  loading = "loading",
  success = "success",
  failed = "failed",
}

interface Mentee {
  id: number;
  name: string;
}

interface MentorRoadmapState {
  mentees: Mentee[]; // Updated to store only id and name
  roadmap: string | null;
  status: currentStatus;
  error: string | null;
}

const initialState: MentorRoadmapState = {
  mentees: [],
  roadmap: null,
  status: currentStatus.idle,
  error: null,
};

// Async thunk to fetch approved mentees
export const fetchApprovedMentees = createAsyncThunk("mentorRoadmap/fetchMentees", async () => {
  try {
    const response = await apiGetApprovedMentees();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.object.map((item: any) => ({
      id: item.User.id,
      name: item.User.name,
    })); // Map response to extract id and name
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch mentees");
  }
});

// Async thunk to generate a roadmap
export const generateRoadmap = createAsyncThunk(
  "mentorRoadmap/generateRoadmap",
  async (domain: string) => {
    try {
      const roadmap = apiPostGenerateRoadMap(); // Replace with actual API logic if needed
      return roadmap;
    } catch (error: any) {
      throw new Error(error.message || "Failed to generate roadmap");
    }
  }
);

const mentorRoadmapSlice = createSlice({
  name: "mentorRoadmap",
  initialState,
  reducers: {},
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
        state.status = currentStatus.success;
        state.roadmap = action.payload;
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to generate roadmap";
      });
  },
});

export default mentorRoadmapSlice.reducer;