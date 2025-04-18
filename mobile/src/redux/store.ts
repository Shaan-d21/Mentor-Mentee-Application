import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/auth/sliceLogin';
import registerReducer from './slices/auth/sliceRegister';
import menteeProfileReducer from './slices/profileSlice/menteeProfileSlice';
import mentorProfileReducer from './slices/profileSlice/mentorProfileSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';
import menteeRequestsSlice from './slices/mentorSlice';
import MenteeRoadmapSlice from './slices/sliceMenteeRoadmap';
import MentorRoadmapSlice from './slices/sliceMentorRoadmap';
import sliceRoadmapTopics from './slices/sliceRoadmapTopics';
import mentorProgressSlice from './slices/sliceMentorProgress';
import { useDispatch } from 'react-redux';

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
    viewRoadmap: sliceRoadmapTopics,
    mentorProgress: mentorProgressSlice,
    checkReport: checkReportSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
