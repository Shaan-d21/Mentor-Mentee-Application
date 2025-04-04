import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiLoginUser } from '../../services/apiLogin';
import { MMKV } from 'react-native-mmkv'

const storage= new MMKV();

enum currentStatus{idle= 'idle', loading= 'loading', success= 'success', failed= 'failed'}
interface User {
  response: any;
  email: string;
  password: string;
  status: currentStatus;
  name: string;
  role: 'mentee' | 'mentor' |'';
}

const initialState: User = {
  response: [],
  email: '',
  password: '',
  name:'',
  role:'',
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
      state.name= action.payload.name;
      state.role = action.payload.role;
      storage.set("role", action.payload.role); 
      console.log('Current state is ', state.response);

    }).addCase(loginUser.rejected, (state, action)=>{
      state.status= currentStatus.failed;
    })
  }
});

export const loginUser= createAsyncThunk("userLogin/login", async({email, password}: {email:string, password:string})=>{
  const response= await apiLoginUser({email, password});
  storage.set("token", response.access_token);
  console.log(response.access_token);
  storage.set("role", response.role);
  // console.log(`Response in the slice is `, response.access_token);
  console.log("token is ", storage.getString("token"));
  console.log("role:", storage.getString("role")); 
  return response;
});

export default sliceLogin.reducer;