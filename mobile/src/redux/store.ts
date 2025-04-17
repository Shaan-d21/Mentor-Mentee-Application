import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/auth/sliceLogin';
import registerReducer from './slices/auth/sliceRegister';
import menteeProfileReducer from './slices/profileSlice/menteeProfileSlice';
import mentorProfileReducer from './slices/profileSlice/mentorProfileSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';
import menteeRequestsSlice from './slices/mentorSlice';
import MenteeRoadmapSlice from './slices/sliceMenteeRoadmap';
import MentorRoadmapSlice from './slices/sliceMentorRoadmap';
import roadmapSlice from './slices/sliceRoadmapTopics';
import checkReportSlice from './slices/SliceCheckReport';
export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeRequests: menteeRequestsSlice,
    menteeDashboard: sliceMenteeDashboard,
    menteeProfile: menteeProfileReducer,
    mentorProfile: mentorProfileReducer,
    mentorDashboard: menteeRequestsSlice,
    menteeRoadmap: MenteeRoadmapSlice,
    mentorRoadmap: MentorRoadmapSlice,
    roadmap: roadmapSlice,
    checkReport: checkReportSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
