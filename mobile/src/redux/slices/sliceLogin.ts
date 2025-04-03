import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiLoginUser } from '../../services/apiLogin';
// import { MMKV } from 'react-native-mmkv'

enum currentStatus{idle= 'idle', loading= 'loading', success= 'success', failed= 'failed'}
interface User {
  response: any;
  email: string;
  password: string;
  status: currentStatus;
}

const initialState: User = {
  response: [],
  email: '',
  password: '',
  status: currentStatus.idle
};

const sliceLogin = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {},

  extraReducers(builder){
    builder.addCase(loginUser.pending, (state, action)=>{
      state.status= currentStatus.loading;

    }).addCase(loginUser.fulfilled, (state, action)=>{
      state.response= action.payload;
      state.status= currentStatus.success;
      // console.log('Current state is ', state.response);

    }).addCase(loginUser.rejected, (state, action)=>{
      state.status= currentStatus.failed;
    })
  }
});

export const loginUser= createAsyncThunk("userLogin/login", async({email, password}: {email:string, password:string})=>{
  const response= await apiLoginUser({email, password});
  // console.log(`Response in the slice is `, response);
  return response;
});

export default sliceLogin.reducer;