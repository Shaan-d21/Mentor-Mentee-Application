import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';
import menteeProfileReducer from './slices/menteeProfileSlice';
import mentorProfileReducer from './slices/mentorProfileSlice';
import sliceMenteeDashboard from './slices/sliceMenteeDashboard';
import menteeRequestsSlice from './slices/mentorSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    menteeRequests: menteeRequestsSlice,
    menteeDashboard: sliceMenteeDashboard,
    menteeProfile: menteeProfileReducer,
    mentorProfile: mentorProfileReducer,
    mentorDashboard: menteeRequestsSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
