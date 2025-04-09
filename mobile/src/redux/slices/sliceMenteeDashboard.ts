// filepath: /Users/promact/Desktop/Mentor-Mentee-Application/Mentor-Mentee-Application/mobile/src/redux/slices/sliceMenteeDashboard.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MentorRequestPayload {
  mentorId: number;
  domain: string;
}

interface MenteeDashboardState {
  mentorList: { id: number; name: string; designation: string; techStack: string }[];
  requestMentorId: number | null;
  approvedMentors: { id: number; name: string; designation: string; techStack: string }[];
}

const initialState: MenteeDashboardState = {
  mentorList: [],
  requestMentorId: null,
  approvedMentors: [],
};

const menteeDashboardSlice = createSlice({
  name: 'menteeDashboard',
  initialState,
  reducers: {
    setMentorList(state, action: PayloadAction<MenteeDashboardState['mentorList']>) {
      state.mentorList = action.payload;
    },
    sendMentorRequest(state, action: PayloadAction<MentorRequestPayload>) {
      state.requestMentorId = action.payload.mentorId;
    },
  },
});

export const { setMentorList, sendMentorRequest } = menteeDashboardSlice.actions;
export default menteeDashboardSlice.reducer;