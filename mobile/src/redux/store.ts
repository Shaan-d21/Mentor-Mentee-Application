import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';
import menteeRequestsReducer from './slices/menteeRequestSlice';
import menteeProfileReducer from './slices/menteeProfileSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeProfile: menteeProfileReducer,
    menteeRequests: menteeRequestsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;