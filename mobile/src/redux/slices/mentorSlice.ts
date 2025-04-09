import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  getApprovedMentees,
  getPendingRequest,
  approveRejectMentee,
} from '../../services/apigetMenteeRequest';

interface Mentee {
  id: number;
  name: string;
  email: string;
  domain: string;
  role: string;
  comment?: string;
}

interface MenteeRequestsState {
  approved: Mentee[];
  pending: Mentee[];
  rejectedRequests: {id: number; name: string}[];
  loading: boolean;
  error: string | null;
}

const initialState: MenteeRequestsState = {
  approved: [],
  pending: [],
  rejectedRequests: [],
  loading: false,
  error: null,
};

export const fetchApprovedMentees = createAsyncThunk(
  'mentees/fetchApproved',
  async () => {
    const response = await getApprovedMentees();
    return response.object;
  },
);

export const fetchPendingRequest = createAsyncThunk(
  'mentees/fetchPending',
  async () => {
    const response = await getPendingRequest();
    return response.object;
  },
);

export const approveRejectMenteeThunk = createAsyncThunk(
  'mentees/approveReject',
  async ({
    menteeId,
    status,
    comment,
  }: {
    menteeId: number;
    status: string;
    comment: string;
  }) => {
    const res = await approveRejectMentee(menteeId, status, comment);
    return {...res.object, status, comment};
  },
);

const menteeSlice = createSlice({
  name: 'mentees',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchApprovedMentees.fulfilled, (state, action) => {
        state.approved = action.payload.map((entry: any) => {
          const user = entry.User;
          return {
            id: user.id,
            name: user.name,
            email: user.mail,
            domain: user.domain_id,
            role: user.role,
          };
        });
      })
      .addCase(fetchPendingRequest.fulfilled, (state, action) => {
        state.pending = action.payload.map((entry: any) => {
          const user = entry.User;
          return {
            id: user.id,
            name: user.name,
            email: user.mail,
            domain: user.domain_id,
            role: user.role,
          };
        });
      })
      .addCase(approveRejectMenteeThunk.fulfilled, (state, action) => {
        state.pending = state.pending.filter(
          mentee => mentee.id !== action.payload.id,
        );

        if (action.payload.status === 'approved') {
          state.approved.push({
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
            domain: action.payload.domain,
            role: action.payload.role,
            comment: action.payload.comment || '',
          });
        } else if (action.payload.status === 'rejected') {
          state.rejectedRequests.push({
            id: action.payload.id,
            name: action.payload.name,
          });
        }
      });
  },
});

export default menteeSlice.reducer;
//export const { acceptMentee, rejectMentee } = menteeSlice.actions;

// // Thunk to approve a mentee
// export const approveMenteeRequestThunk = createAsyncThunk(
//   'menteeRequests/approve',
//   async (menteeId: number, {getState, rejectWithValue}) => {
//     try {
//       await approveMentee(menteeId);

//       const state = getState() as {menteeRequests: MenteeRequestsState};
//       const mentee = state.menteeRequests.pendingRequests.find(
//         m => m.id === menteeId,
//       );

//       if (!mentee) throw new Error('No Mentees Found');
//       return mentee;
//     } catch (error) {
//       return rejectWithValue('Error approving mentee');
//     }
//   },
// );

// const menteeRequestsSlice = createSlice({
//   name: 'menteeRequests',
//   initialState,
//   reducers: {
//     acceptMentee: (state, action: PayloadAction<number>) => {
//       const mentee = state.pendingRequests.find(m => m.id === action.payload);
//       if (mentee) {
//         state.acceptedRequests.push(mentee);
//         state.pendingRequests = state.pendingRequests.filter(
//           m => m.id !== action.payload,
//         );
//       }
//     },
//     rejectMentee: (state, action: PayloadAction<number>) => {
//       const mentee = state.pendingRequests.find(m => m.id === action.payload);
//       if (mentee) {
//         state.rejectedRequests.push({id: mentee.id, name: mentee.name});
//         state.pendingRequests = state.pendingRequests.filter(
//           m => m.id !== action.payload,
//         );
//       }
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(fetchMenteeRequests.fulfilled, (state, action) => {
//         state.pendingRequests = action.payload.map((entry: any) => {
//           const user = entry.User;
//           return {
//             id: user.id,
//             name: user.name,
//             email: user.mail,
//             domain: user.domain_id, // You can map to domain name if needed
//             role: user.role,
//           };
//         });
//       })
//       .addCase(approveMenteeRequestThunk.fulfilled, (state, action) => {
//         const mentee = state.pendingRequests.find(
//           m => m.id === action.payload.id,
//         );
//         if (mentee) {
//           state.acceptedRequests.push(mentee);
//           state.pendingRequests = state.pendingRequests.filter(
//             m => m.id !== action.payload.id,
//           );
//         }
//       })
//       .addCase(approveMenteeRequestThunk.rejected, (state, action) => {
//         console.error('Approval failed:', action.payload);
//       });
//   },
// });
