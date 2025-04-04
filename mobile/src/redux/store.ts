import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import menteeRequestsReducer from './slices/mentorSlice';
import registerReducer from './slices/sliceRegister';
import menteeProfileReducer from './slices/menteeProfileSlice';
import mentorProfileReducer from './slices/mentorProfileSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';
import menteeRoadmapReducer from './slices/sliceMenteeRoadmap';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeRequests: menteeRequestsReducer,
    menteeDashboard: sliceMenteeDashboard,
    menteeProfile: menteeProfileReducer,
    mentorProfile: mentorProfileReducer,
    menteeRoadmap:menteeRoadmapReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;