import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import menteeRequestsReducer from './slices/menteeRequestSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    menteeRequests: menteeRequestsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;