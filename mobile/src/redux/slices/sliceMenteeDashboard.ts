import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { apiGetMentorList } from "../../services/apiMenteeDashboard/apiGetMentorList";
import { apiSendMentorRequest } from "../../services/apiMenteeDashboard/apiSendMentorRequest";
import { MMKV } from "react-native-mmkv";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" };

interface Mentor {
    "designation": string,
    "domain": string,
    "id": number,
    "main": string,
    "name": string,
    "reason": string,
    "score": number
}

interface MenteeDashboardState {
    status: currentStatus,
    domain_mentors: Mentor[] | null,
    other_domain_mentors: Mentor[] | null,
    requestMentorId: number| null
}

interface MentorListPayload {
  domain_mentors: Mentor[];
  other_domain_mentors: Mentor[];
}


const initialState: MenteeDashboardState = {
    status: currentStatus.idle,
    domain_mentors: null,
    other_domain_mentors: null,
    requestMentorId: null
}


export const getMentorList = createAsyncThunk("menteeDashboard/getMentorList", async (domain: string) => {
  const response = await apiGetMentorList({domain:domain});
  // console.log("Async Thunk getMentorList: ", response);
    // console.log("Async Thunk getMentorList: ", response);
    return response;
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
        }).addCase(getMentorList.fulfilled, (state, action: PayloadAction<MentorListPayload>) => {
            // console.log("payload action of domain_mentors is",action.payload.domain_mentors);
            // console.log("payload action other_domain_mentors is",action.payload.other_domain_mentors);
            
            state.domain_mentors= action.payload.domain_mentors;
            state.other_domain_mentors= action.payload.other_domain_mentors;
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