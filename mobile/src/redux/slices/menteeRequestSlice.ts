import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Mentee {
  id: string;
  name: string;
}

interface MenteeRequestsState {
  pendingRequests: Mentee[];
  acceptedRequests: Mentee[];
  rejectedRequests: { id: string; name: string; reason: string }[];
}

const initialState: MenteeRequestsState = {
  pendingRequests: [],
  acceptedRequests: [],
  rejectedRequests: [],
};

// Async Thunk for Fetching Mentees
export const fetchMenteeRequests = createAsyncThunk(
  'menteeRequests/fetch',
  async () => {
    console.log("fetches the data")
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Jane Smith' },

    ];
  }
);

const menteeRequestsSlice = createSlice({
  name: 'menteeRequests',
  initialState,
  reducers: {
    acceptMentee: (state, action: PayloadAction<string>) => {
      const mentee = state.pendingRequests.find(m => m.id === action.payload);
      if (mentee) {
        state.acceptedRequests.push(mentee);
        state.pendingRequests = state.pendingRequests.filter(m => m.id !== action.payload);
      }
    },
    rejectMenteeWithReason: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const mentee = state.pendingRequests.find(m => m.id === action.payload.id);
      if (mentee) {
        state.rejectedRequests.push({ ...mentee, reason: action.payload.reason });
        state.pendingRequests = state.pendingRequests.filter(m => m.id !== action.payload.id);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMenteeRequests.fulfilled, (state, action) => {
      state.pendingRequests = action.payload;
    });
  },
});

export const { acceptMentee, rejectMenteeWithReason } = menteeRequestsSlice.actions;
export default menteeRequestsSlice.reducer;
