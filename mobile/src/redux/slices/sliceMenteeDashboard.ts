import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { apiGetMentorList } from "../../services/apiMentorDashboard/apiGetMentorList";
import { apiSendMentorRequest } from "../../services/apiMentorDashboard/apiSendMentorRequest";
import { MMKV } from "react-native-mmkv";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" };

interface Mentor {
    "name": string,
    "id": number,
    "domain": string,
}

interface User {
    status: currentStatus,
    mentorList: Mentor[] | null,
    requestMentorId: number| null
}

const initialState: User = {
    status: currentStatus.idle,
    mentorList: null,
    requestMentorId: null
}


export const getMentorList = createAsyncThunk("menteeDashboard/getMentorList", async (domain: string) => {
    const response = await apiGetMentorList({domain:domain});
    // console.log("Async Thunk: ", response.mentors);
    return response.mentors;
});

export const sendMentorRequest = createAsyncThunk("menteeDashboard/sendRequest", async ({ id, domain }: { id: number; domain: string }) => {
    // console.log(`sendMentorRequest values are ${id} and ${domain}`);
    const response= await apiSendMentorRequest({domain: domain, mentorId: id});
    console.log(`Requested id is ${response}`);
    // if(response.data.status_code=== 200) return id;
    // return -1;
    return response.status_code;
});

const sliceMenteeDashboard = createSlice({
    name: "menteeDashboard",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getMentorList.pending, (state, action) => {
            state.status = currentStatus.loading;
        }).addCase(getMentorList.rejected, (state, action) => {
            state.status = currentStatus.failed
        }).addCase(getMentorList.fulfilled, (state, action: PayloadAction<Mentor[]>) => {
            // console.log(`payload action is`);
            // console.log(`${JSON.stringify(action.payload)}`)
            state.mentorList= action.payload;

            // console.log(`extraReducers: ${JSON.stringify(state.mentorList)}`);
            state.status = currentStatus.success;
        })

        /* Change the state of the press button */
        .addCase(sendMentorRequest.pending, (state, action)=>{
            state.requestMentorId= null
        }).addCase(sendMentorRequest.rejected, (state, action)=>{
            state.requestMentorId= null
        }).addCase(sendMentorRequest.fulfilled, (state, action)=>{
            // if(action.payload!== 200) state.requestMentorId= null;
            // else state.requestMentorId= action.payload
            if (action.payload === 200) {
                state.requestMentorId = action.meta.arg.id; // Set only if successful
            }
        })
    }
});

export default sliceMenteeDashboard.reducer;