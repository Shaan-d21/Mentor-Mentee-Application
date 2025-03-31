import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';
import menteeRequestsReducer from './slices/menteeRequestSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeRequests: menteeRequestsReducer,
    menteeDashboard: sliceMenteeDashboard
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;