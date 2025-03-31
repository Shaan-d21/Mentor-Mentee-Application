import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getMenteeRequests, approveMentee } from '../../services/menteeRequestsApi';

interface Mentee {
  id: string;
  name: string;
}

interface MenteeRequestsState {
  pendingRequests: Mentee[];
  acceptedRequests: Mentee[];
  rejectedRequests: { id: string; name: string; }[];
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
    const data = await getMenteeRequests();
    console.log("Data:", data);
    return data.object;
  }
);
export const approveMenteeRequestThunk = createAsyncThunk(
  'menteeRequests/approve', 
  async (menteeId: string, { rejectWithValue }) => {
    try {
      await approveMentee(menteeId);
      return menteeId;
    } catch (error) {
      return rejectWithValue("Error approving mentee");
    }
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
    rejectMentee: (state, action: PayloadAction<string>) => {
      const mentee = state.pendingRequests.find(m => m.id === action.payload);
      if (mentee) {
        state.rejectedRequests.push({ id: mentee.id, name: mentee.name });
        state.pendingRequests = state.pendingRequests.filter(m => m.id !== action.payload);
      }
    
    },
    
},
extraReducers: (builder) => {
  builder.addCase(fetchMenteeRequests.fulfilled, (state, action) => {
    state.pendingRequests = action.payload.map((mentee: any) => ({
      id: mentee.mentee_id,
      name: mentee.mentee_name
    }));
  })
  .addCase(approveMenteeRequestThunk.fulfilled, (state, action) => {
    const mentee = state.pendingRequests.find(m => m.id === action.payload);
    if (mentee) {
      state.acceptedRequests.push(mentee);
      state.pendingRequests = state.pendingRequests.filter(m => m.id !== action.payload);
    }
  })
  .addCase(approveMenteeRequestThunk.rejected, (state, action) => {
    console.error("Approval failed:", action.payload);
  });
}
});
  


export const { acceptMentee, rejectMentee } = menteeRequestsSlice.actions;
export default menteeRequestsSlice.reducer;
