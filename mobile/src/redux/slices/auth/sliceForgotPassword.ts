import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiVerifyEmail, apiVerifyOtp, apiConfirmPassword } from '../../../services/apiForgotPassword';

interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'failed';
  message: string | null;
  error: string | null;
}

const initialState: AuthState = {
  status: 'idle',
  message: null,
  error: null,
};

// Verify Email Thunk
export const verifyEmailThunk = createAsyncThunk(
  'auth/verifyEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await apiVerifyEmail(email);
      // Check if the response is null or undefined
      if (!response || response.status_code !== 200) {
        throw new Error(response?.message || 'Incorrect Email');
      }
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Verify OTP Thunk
export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otp, email }: { otp: number; email: string }, { rejectWithValue }) => {
    try {
      const response = await apiVerifyOtp(email, otp);
      // Check if the response is null or undefined
      if (!response || response.status_code !== 200) {
        throw new Error(response?.message || 'Incorrect Otp');
      }
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Confirm Password Thunk
export const confirmPasswordThunk = createAsyncThunk(
  'auth/confirmPassword',
  async ({ password }: { password: string }, { rejectWithValue }) => {
    try {
      const response = await apiConfirmPassword(password);
      // Check if the response is null or undefined
      if (!response || response.status_code !== 200) {
        throw new Error(response?.message || 'Incorrect Password');
      }
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.status = 'idle';
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Shared Logic for all thunks
    const handlePending = (state: AuthState) => {
      state.status = 'loading';
      state.message = null;
      state.error = null;
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.status = 'failed';
      state.error = action.payload || 'Something went wrong';
    };
    const handleFulfilled = (state: AuthState, action: any) => {
      state.status = 'success';
      state.message = action.payload;
      state.error = null;
    };

    builder
      .addCase(verifyEmailThunk.pending, handlePending)
      .addCase(verifyEmailThunk.fulfilled, handleFulfilled)
      .addCase(verifyEmailThunk.rejected, handleRejected)

      .addCase(verifyOtpThunk.pending, handlePending)
      .addCase(verifyOtpThunk.fulfilled, handleFulfilled)
      .addCase(verifyOtpThunk.rejected, handleRejected)

      .addCase(confirmPasswordThunk.pending, handlePending)
      .addCase(confirmPasswordThunk.fulfilled, handleFulfilled)
      .addCase(confirmPasswordThunk.rejected, handleRejected);
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
