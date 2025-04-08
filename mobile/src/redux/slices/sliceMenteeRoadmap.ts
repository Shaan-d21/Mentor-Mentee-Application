import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getApprovedMentors } from "../../services/apiRoadmap/apigetMenteeRoadmap";

// Mentor Interface
export interface ApprovedMentor {
  mentor_id: number;
  mentor_name: string;
  domain_id: number;
  domain_name: string;
}

// Redux State
interface MentorState {
  mentorsAndDomain: ApprovedMentor[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: MentorState = {
  mentorsAndDomain: [],
  loading: false,
  error: null,
};

// Async Thunk to Fetch Mentors
export const fetchMentors = createAsyncThunk<ApprovedMentor[], void>(
  "mentor/fetchMentors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getApprovedMentors(); // Ensure this returns ApiResponse
      // @ts-ignore

      if (response && response.object) {
      // @ts-ignore
        return response.object; // Extract the array from response.data.object
      } else {
        return rejectWithValue('Failed to fetch mentors: Invalid response format');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch mentors');
    }
  }
);

// Redux Slice
const menteeRoadmapSlice = createSlice({
  name: "mentor",
  initialState,
  reducers: {}, // No synchronous reducers needed now
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action: PayloadAction<ApprovedMentor[]>) => {
        state.loading = false;
        state.mentorsAndDomain = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export reducer for store
export default menteeRoadmapSlice.reducer;