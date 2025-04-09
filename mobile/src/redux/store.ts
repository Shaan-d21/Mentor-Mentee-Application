import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';
import menteeProfileReducer from './slices/menteeProfileSlice';
import mentorProfileReducer from './slices/mentorProfileSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';
import menteeRequestsSlice from './slices/mentorSlice';
import MenteeRoadmapSlice from './slices/sliceMenteeRoadmap';
import MentorRoadmapSlice from './slices/sliceMentorRoadmap';
import  roadmapSlice from './slices/sliceRoadmapTopics';

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
    mentorRoadmap:MentorRoadmapSlice,
    roadmap: roadmapSlice
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
