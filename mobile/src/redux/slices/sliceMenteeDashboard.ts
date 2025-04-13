import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { apiGetMentorList } from "../../services/apiMenteeDashboard/apiGetMentorList";
import { apiSendMentorRequest } from "../../services/apiMenteeDashboard/apiSendMentorRequest";
import { MMKV } from "react-native-mmkv";
import { apiGetApprovedMentorList } from "../../services/apiMenteeDashboard/apiGetApprovedMentorList";
import { apiGetRequests } from "../../services/apiGetRequests";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" };

export interface Mentor {
    "designation": string,
    "domain": string,
    "id": number,
    "mail": string,
    "name": string,
    "reason": string,
    "score": number
}
interface MetorApprove{
    "id": number,
    "name": string,
    "mail": string,
    "designation": string,
    "domain_name": string,
    "exp": number,
}

interface MenteeDashboardState {
    status: currentStatus,
    domain_mentors: Mentor[] | null,
    other_domain_mentors: Mentor[] | null,
    requestMentorId: number| null,
    getApprovedMentors: MetorApprove[] | null,
    getDomain: String[] | null
}

interface MentorListPayload {
    domain_mentors: Mentor[];
    other_domain_mentors: Mentor[];
}


const initialState: MenteeDashboardState = {
    status: currentStatus.idle,
    domain_mentors: null,
    other_domain_mentors: null,
    requestMentorId: null,
    getApprovedMentors: null,
    getDomain: null
}

export const getDomainList= createAsyncThunk("menteeDashboard/getDomainList", async()=>{
    const response= await apiGetRequests();
    // console.log("getDomainList asyncThunk: ", response);
    return response;
});

export const getMentorList = createAsyncThunk("menteeDashboard/getMentorList", async (domain: string) => {
    const response = await apiGetMentorList({domain:domain});
    const response1= await apiGetRequests();

    const sendRequestMentorIds: Set<String>= new Set(response1.map((user: {mentor_name: string;
        mentor_mail: string;
        mentor_designation: string;
        domain_name: string;
        status: 'approved' | 'pending' | 'not approved';
        comment: string | null;})=>{
            // console.log("Hii", user.mentor_mail)
            return user.mentor_mail}));
        
        // console.log(sendRequestMentorIds);
    
    const filterResponseDomainMentors= response.domain_mentors
                                .filter(
                                    (mentor: any) => !sendRequestMentorIds.has(mentor.mail)
                                );
    const filterResponseOtherDomainMentors= response.other_domain_mentors
                                .filter(
                                    (mentor: any)=> !sendRequestMentorIds.has(mentor.mail)
                                );
    // console.log("Response of the filteredDomainMentors: ", filterResponseDomainMentors);
    // console.log("Response of the filteredOtherDomainMentors: ", filterResponseOtherDomainMentors);
    // console.log("Async Thunk mentors that has to be avoided: ", sendRequestMentorIds);
    // console.log("Async thunk all mentors: ", response);
    // return response;
    return {
        domain_mentors: filterResponseDomainMentors,
        other_domain_mentors: filterResponseOtherDomainMentors
    };
});

export const sendMentorRequest = createAsyncThunk("menteeDashboard/sendRequest", async ({ id, domain }: { id: number; domain: string }) => {
    // console.log(`sendMentorRequest values are ${id} and ${domain}`);
    const response= await apiSendMentorRequest({domain: domain, mentorId: id});
    // console.log(`Requested id is ${JSON.stringify(response)}`);
    // if(response.data.status_code=== 200) return id;
    // return -1;
    return response.status_code;
});

export const getApprovedMentorList= createAsyncThunk("menteeDashboard/getApprovedMentorList", async()=> {
    const response= await apiGetApprovedMentorList();
    console.log("sliceMenteeDashboard getApprovedMentorList: ", response);

    return response;
});

const sliceMenteeDashboard = createSlice({
    name: "menteeDashboard",
    initialState,
    reducers: {
        resetRequestState: (state) => {
            state.requestMentorId = null;
            state.domain_mentors= null;
            state.other_domain_mentors= null;
        },
    },
    extraReducers(builder) {
        /* To get all the list of the mentors of the specific domain */
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
                // console.log("Success");
                // console.log(state.requestMentorId)
            }
            // console.log("Lagg gaye Guru");
        })

        /* Get the list of the approved mentors*/
        .addCase(getApprovedMentorList.pending, (state)=>{
            state.status= currentStatus.loading
        }).addCase(getApprovedMentorList.rejected, (state, action)=>{
            state.status= currentStatus.failed
        }).addCase(getApprovedMentorList.fulfilled, (state, action)=>{
            state.getApprovedMentors= action.payload.object
            // console.log("state is ", state.getApprovedMentors);
        })

        /* Get the list of domain that has to be avoided  */
        .addCase(getDomainList.pending, (state)=>{
            state.status= currentStatus.loading
        }).addCase(getDomainList.rejected, (state)=>{
            state.status= currentStatus.failed
        }).addCase(getDomainList.fulfilled, (state, action)=>{
            // console.log("Action.payload is ", action.payload);
            // action.payload
            state.getDomain= (action.payload as {
                mentor_name: string;
                mentor_mail: string;
                mentor_designation: string;
                domain_name: string;
                status: 'approved' | 'pending' | 'not approved';
                comment: string | null;
              }[])
                    .filter(item=> item.status=== "pending" || item.status=== "approved")
                    .map(item=> item.domain_name)
            // console.log("Domain that has to be disable are ", state.getDomain)
        })

    }
});

export const {resetRequestState} = sliceMenteeDashboard.actions;
export default sliceMenteeDashboard.reducer;