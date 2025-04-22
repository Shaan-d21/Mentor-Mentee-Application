import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiLoginUser } from '../../../services/apiLogin';
import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new MMKV();

enum currentStatus {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  failed = 'failed'
}

interface User {
  response: any;
  email: string;
  password: string;
  status: currentStatus;
  name: string;
  profile_status: boolean;
  role: string;
  rememberMe: boolean; // ✅ ADDED
}

const initialState: User = {
  response: [],
  email: '',
  password: '',
  name: '',
  role: '',
  profile_status: false,
  status: currentStatus.idle,
  rememberMe: false // ✅ ADDED
};

const sliceLogin = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    logout(state) {
      state.response = [];
      state.email = '';
      state.password = '';
      state.name = '';
      state.role = '';
      state.status = currentStatus.idle;
      state.profile_status = false;
      state.rememberMe = false; // ✅ RESET
      AsyncStorage.removeItem("rememberMe"); // ✅ DELETE FROM MMKV
      AsyncStorage.removeItem("email");
      AsyncStorage.removeItem("password");
    },
    changeProfileStatus(state, action: PayloadAction<boolean>) {
      state.profile_status = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    changeStatusToInitial(state) {
      state.status = currentStatus.idle;
      state.response = [];
      state.email = '';
      state.password = '';
      state.role = '';
      state.profile_status = false;
    },
    setRememberMe(state, action: PayloadAction<boolean>) { // ✅ NEW REDUCER
      state.rememberMe = action.payload;
      storage.set("rememberMe", JSON.stringify(action.payload)); // ✅ STORE IN MMKV
    },
    loginSuccess(state, action: PayloadAction<{ email: string; password: string; role: string; rememberMe: boolean }>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.role = action.payload.role;
      state.rememberMe = action.payload.rememberMe;
    
      if (action.payload.rememberMe) {
        storage.set("rememberMe", true); // ✅ Save to MMKV
        storage.set("email", action.payload.email);
        storage.set("password", action.payload.password);
        storage.set("role", action.payload.role);
      }
    },
    
  },

  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state, action) => {
      state.status = currentStatus.loading;
      console.log('pending');
    }).addCase(loginUser.fulfilled, (state, action) => {
      console.log(`fulfilled: ${JSON.stringify(action.payload)}`);
      state.response = action.payload;
      state.status = currentStatus.success;
      state.name = action.payload.user_name;
      state.role = action.payload.role;
      state.profile_status = action.payload.profile_status;
      console.log('Profile fulfilled', action.payload.profile_status);
      storage.set("role", state.role); // ✅ STORE ROLE
    }).addCase(loginUser.rejected, (state, action) => {
      console.log('rejected');
      console.log(action.payload);
      state.status = currentStatus.failed;
    });
  }
});

export const loginUser = createAsyncThunk(
  "userLogin/login",
  async ({ email, password }: { email: string, password: string }) => {
    const response = await apiLoginUser({ email, password });
    console.log(`Async thunk ${JSON.stringify(response)}`);
    storage.set("token", response.access_token); // ✅ STORE TOKEN
    storage.set("role", response.role);
    return response;
  }
);

// ✅ ADDED setRememberMe to exports
export const { logout, setName, changeProfileStatus, changeStatusToInitial, setRememberMe } = sliceLogin.actions;

export default sliceLogin.reducer;
