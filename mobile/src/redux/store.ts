import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
console.log("Initial Auth State:", store.getState().auth);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
