import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import menteeRequestsReducer from './slices/mentorSlice';
import registerReducer from './slices/sliceRegister';
import menteeProfileReducer from './slices/menteeProfileSlice';
import mentorProfileReducre from './slices/mentorProfileSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeProfile: menteeProfileReducer,
    menteeRequests: menteeRequestsReducer,
    mentorProfile: mentorProfileReducre,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;