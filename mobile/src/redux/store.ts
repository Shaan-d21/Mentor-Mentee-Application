import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/sliceLogin';
import registerReducer from './slices/sliceRegister';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;