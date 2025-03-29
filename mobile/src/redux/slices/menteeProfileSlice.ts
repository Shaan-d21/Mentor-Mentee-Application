import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiaddMenteeProfileSkill, apigetMenteeProfile, apiUpdateMenteeProfile } from "../../services/apimenteeprofile";
import { MenteeProfile, MenteeProfileImpl } from "../../types/MenteeProfileTypes";

enum currentStatus { idle = 'idle', loading = 'loading', success = 'success', failed = 'failed' }
interface MenteeProfilestate {
    response: MenteeProfile | undefined;
    status: currentStatus;
}

const initialState: MenteeProfilestate = {
    response: undefined,
    status: currentStatus.idle
};

const sliceProfile = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(getmenteeprofile.pending, (state, action) => {
            state.status = currentStatus.loading;
        }).addCase(getmenteeprofile.fulfilled, (state, action) => {
            if ('name' in action.payload) {
                state.response = MenteeProfileImpl.fromJSON(JSON.stringify(action.payload)) as MenteeProfile;
            }
            state.status = currentStatus.success;
        }).addCase(getmenteeprofile.rejected, (state, action) => {
            state.status = currentStatus.failed;
        })
    }
});

export const getmenteeprofile = createAsyncThunk("profile/get", async () => {
try{
    const response = await apigetMenteeProfile();
    console.log(`Response from mentee/profile screen the server is `, response['Skill set']);
     const res:MenteeProfile=  MenteeProfileImpl.fromJSON(JSON.stringify(response)) as MenteeProfile;
     console.log(`Response from mentee/profile  the server is `, res);
     return res.toJSON();
}
catch(error: any) {
    console.error("mentee/profile error: ", error);
    throw error;
}


});
export const updateprofileskill = createAsyncThunk("profile/addSkill", async () => {


    const response = await apiUpdateMenteeProfile();
    if (response == 1) { getmenteeprofile(); }
});
export const updateProfileData = createAsyncThunk("profile/update", async () => {
    const response = await apiaddMenteeProfileSkill();
    if (response == 1) { getmenteeprofile(); }
});
export default sliceProfile.reducer;