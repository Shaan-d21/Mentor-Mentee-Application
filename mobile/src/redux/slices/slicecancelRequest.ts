import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {apiCancelRequest} from '../../services/apiMenteeDashboard/apicancelRequest';
import {Alert} from 'react-native';

interface CancelRequestState {
  requests: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CancelRequestState = {
  requests: [],
  loading: false,
  error: null,
};

export const cancelRequest = createAsyncThunk(
  'requests/cancelRequest',
  async (mentorId: number, {rejectWithValue}) => {
    try {
      await apiCancelRequest({mentorId});
      return mentorId;
    } catch (error: any) {
      console.error(
        'Cancel Request Error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(cancelRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          request => request.mentor_id !== action.payload,
        );
        state.error = null;
        Alert.alert('Request cancelled successfully.');
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default requestsSlice.reducer;
