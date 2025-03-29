import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';
import menteeRequestsReducer from './slices/menteeRequestSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer
    menteeRequests: menteeRequestsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;