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
  reducers: {
    logout(state){
      state.response= [];
      state.email= '';
      state.password=  '';
      state.name= '';
      state.role= '';
      state.status= currentStatus.idle; 
      // state.currentStatus.idle
    },
    setName(state, action:PayloadAction<string>){
      state.name= action.payload
    }
  },

  extraReducers(builder){
    builder.addCase(loginUser.pending, (state, action)=>{
      state.status= currentStatus.loading;
      console.log('pending');

    }).addCase(loginUser.fulfilled, (state, action)=>{
      console.log(`fulfilled: ${JSON.stringify(action.payload)}`)
      state.response= action.payload;
      state.status= currentStatus.success;
      state.name= action.payload.user_name;
      state.role = action.payload.role;

      // console.log('Current state is ', state.response);
      storage.set("role", state.role); 

    }).addCase(loginUser.rejected, (state, action)=>{
      console.log('rejected')
      console.log(action.payload);
      state.status= currentStatus.failed;
    })
  }
});

export const loginUser= createAsyncThunk("userLogin/login", async({email, password}: {email:string, password:string})=>{
  const response= await apiLoginUser({email, password});
  console.log(`Async thunk ${JSON.stringify(response)}`);
  storage.set("token", response.access_token);
  // console.log(response.access_token);
  storage.set("role", response.role);
  // console.log(`Response in the slice is `, response.access_token);
  // console.log("token is ", storage.getString("token"));
  // console.log("role:", storage.getString("role")); 
  return response;
});

export const { logout, setName }= sliceLogin.actions;
export default sliceLogin.reducer;