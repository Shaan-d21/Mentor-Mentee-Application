import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiFetchReport} from '../../services/apiMenteeDashboard/apiCheckReport';

interface CheckReportState {
  data: {
    //score: number;
    existingSkills: string[];
    missingSkills: string[];
    summary: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CheckReportState = {
  data: null,
  status: 'idle',
  error: null,
};

// Updated fetchCheckReport thunk to send mentorId, domain, and score in the request body
export const fetchCheckReport = createAsyncThunk(
  'checkReport/fetchCheckReport',
  async (
    {
      mentorId,
      domain,
      score,
    }: {mentorId: number; domain: string; score: number},
    {rejectWithValue},
  ) => {
    try {
      const response = await apiFetchReport({mentorId, domain, score}); // Call the API function
      return response; // Assuming the API returns the report data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const checkReportSlice = createSlice({
  name: 'checkReport',
  initialState,
  reducers: {
    resetCheckReport: state => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCheckReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCheckReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        //state.data = action.payload;
      })
      .addCase(fetchCheckReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {resetCheckReport} = checkReportSlice.actions;
export default checkReportSlice.reducer;
