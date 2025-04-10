import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiaddMenteeProfileSkill, apigetMenteeProfile, apiUpdateMenteeProfile } from "../../services/profile/apimenteeprofile";
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
      try {
        if ('name' in action.payload) {
          console.log(`Get menteeProfileSlice extraReducer: ${JSON.stringify(action.payload)}`);
          state.response = MenteeProfileImpl.fromJSON(JSON.stringify(action.payload)) as MenteeProfile;
          console.log(`Get menteeProfileSlice extraReducer state: ${JSON.stringify(state.response)}`)
        }
        state.status = currentStatus.success;
      } catch (error) {
        console.error("mentee/profile error: ", error);
        state.status = currentStatus.failed;
      }
    }).addCase(getmenteeprofile.rejected, (state, action) => {
      state.status = currentStatus.failed;
    }).addCase(updateprofileskill.fulfilled, (state, action) => {
      try {
        state.response = MenteeProfileImpl.fromJSON(JSON.stringify(action.payload)) as MenteeProfile;
        state.status = currentStatus.success;
      } catch (error) {
        console.error("mentee/profile error: ", error);
        state.status = currentStatus.failed;
      }
    })
      .addCase(updateprofileskill.rejected, (state, action) => {
        state.status = currentStatus.failed;
      })
      .addCase(updateProfileData.fulfilled, (state, action) => {
        try {
          state.response = MenteeProfileImpl.fromJSON(JSON.stringify(action.payload)) as MenteeProfile;
          state.status = currentStatus.success;
        } catch (error) {
          console.error("mentee/profile error: ", error);
          state.status = currentStatus.failed;
        }
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.status = currentStatus.failed;
      });


  }
});

export const getmenteeprofile = createAsyncThunk("profile/get", async () => {
  try {
    const response = await apigetMenteeProfile();
    console.log(`getmenteeprofile asyncThunk: ${JSON.stringify(response)}`);
    // console.log(`Response from mentee/profile screen the server is `, response['Skill set']);
    const res: MenteeProfile = MenteeProfileImpl.fromJSON(JSON.stringify(response)) as MenteeProfile;
    console.log(`getmenteeprofile asyncThunk set the res: ${JSON.stringify(res)}`)
    // console.log(`Response from mentee/profile  the server is `, res);
    return res.toJSON();
  }
  catch (error: any) {
    console.error("mentee/profile error: ", error);
    return { error: "Unexpected response from server", status: error };
  }


});
export const updateProfileData = createAsyncThunk("profile/update", async ({ name, contact, designation }: {  name: string,contact: string, designation: string }) => {


  const response = await apiUpdateMenteeProfile(name, contact, designation);
  if (response === 1) {
    const updatedProfile = await apigetMenteeProfile();
    return updatedProfile;
  }
  throw new Error("Failed to update profile data");
});


export const updateprofileskill = createAsyncThunk(
  "profile/addSkill",
  async (skill: string) => {
    // Call your API to add the new skill
    const response = await apiaddMenteeProfileSkill(skill);
    if (response === 1) {
      const updatedProfile = await apigetMenteeProfile();
      return updatedProfile;
    }
    throw new Error("Failed to update skill");
  }
);

export default sliceProfile.reducer;