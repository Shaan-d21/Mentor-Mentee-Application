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
      // Correctly pass the parameters to the apiFetchReport function
      console.log(mentorId, domain, score); // Debugging log to verify parameters
      const response = (await apiFetchReport({
        domain: domain,
        mentorId: mentorId,
        score: score,
      })) as {
        e_skills?: string[];
        m_skills?: string[];
        summary?: string;
      }; // Call the API function

      console.log('API Response:', response); // Debugging log to verify API response

      return {
        existingSkills: response.e_skills || [],
        missingSkills: response.m_skills || [],
        summary: response.summary || '',
      };
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
        state.data = action.payload;
        //console.log('Redux State Updated:', state.data); // Debugging log for Redux state
      })
      .addCase(fetchCheckReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {resetCheckReport} = checkReportSlice.actions;
export default checkReportSlice.reducer;
