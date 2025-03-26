import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: string | null;
  email: string;
  password: string;
  name: string;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  userType: null,
  email: '',
  password: '',
  name: '',
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<string | null>) => {
      state.userType = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.userType = null;
      state.email = '';
      state.password = '';
      state.name = '';
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const {
  setUserType,
  setEmail,
  setPassword,
  setName,
  setCredentials,
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
