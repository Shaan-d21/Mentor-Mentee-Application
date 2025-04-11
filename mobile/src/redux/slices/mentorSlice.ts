import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getApprovedMentees,
  getPendingRequest,
  approveRejectMentee,
} from '../../services/apigetMenteeRequest';

enum currentStatus {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  failed = 'failed',
}

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
  rejectedRequests: { id: number; name: string }[];
  status: currentStatus;
  error: string | null;
  isActionDone: null|0|1;
}

const initialState: MenteeRequestsState = {
  approved: [],
  pending: [],
  rejectedRequests: [],
  error: null,
  status: currentStatus.idle,
  isActionDone: null,
};

export const fetchApprovedMentees = createAsyncThunk(
  'mentees/fetchApproved',
  async () => {
    const response = await getApprovedMentees();
    console.log('Approved Mentees:', response);
    if (response.error) {
      throw new Error(response.error);
    } else {
      return response.object;
    }
  },
);

export const fetchPendingRequest = createAsyncThunk(
  'mentees/fetchPending',
  async () => {
    const response = await getPendingRequest();
    if (response.error) {
      throw new Error(response.error);
    }
    console.log('Pending Request:', response);
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
    if(res.error) {
      throw new Error(res.error);
    }
    console.log('Approve/Reject Mentee Response:', res);

    return 1;
  },
);

const menteeSlice = createSlice({
  name: 'mentees',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchApprovedMentees.fulfilled, (state, action) => {
        console.log('Pending Request Payload:', action.payload);

        state.approved = action.payload.map((entry: any) => ({
          id: entry.id,
          name: entry.name,
          email: entry.mail,
          domain: entry.domain_name,
          role: entry.role,
        }));
      })
      .addCase(fetchApprovedMentees.pending, state => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(fetchApprovedMentees.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error =
          action.error.message || 'Failed to fetch approved mentees';
      })
      // .addCase(fetchPendingRequest.fulfilled, (state, action) => {
      //   console.log('Pending Request Payload:', action.payload);

      //   state.pending = action.payload.map((entry: any) => {
      //     const user = entry.User;
      //     return {
      //       id: user.id,
      //       name: user.name,
      //       email: user.mail,
      //       domain: user.domain_id,
      //       role: user.role,
      //     };
      //   });
      // })
      .addCase(fetchPendingRequest.fulfilled, (state, action) => {
        console.log('Pending Request Payload:', action.payload);
state.status = currentStatus.success;
        state.error = null;
        state.pending = action.payload.map((entry: any) => ({
          id: entry.id,
          name: entry.name,
          email: entry.mail,
          domain: entry.domain_name,
          role: entry.role,
        }));
      })
      .addCase(fetchPendingRequest.pending, state => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(fetchPendingRequest.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error =
          action.error.message || 'Failed to fetch pending requests';
      })
      .addCase(approveRejectMenteeThunk.pending, state => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(approveRejectMenteeThunk.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || 'Failed to approve/reject mentee';
      })
      .addCase(approveRejectMenteeThunk.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.isActionDone = action.payload==1? 1 : 0;
        state.error = null;
        console.log('Action Done:', state.isActionDone);
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
