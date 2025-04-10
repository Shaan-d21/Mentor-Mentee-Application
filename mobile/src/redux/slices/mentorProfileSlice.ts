import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MenteeProfile, MenteeProfileImpl} from '../../types/MenteeProfileTypes';
import {
  apiaddMentorProfileSkill,
  apigetMentorProfile,
  apiUpdateMentorProfile,
} from '../../services/profile/apiMentorProfile';
import {
  MentorProfiletype,
  MentorProfileImpl,
} from '../../types/MentorProfileTypes';

enum currentStatus {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  failed = 'failed',
}
interface MenteeProfilestate {
  response: MentorProfiletype | undefined;
  status: currentStatus;
}

const initialState: MenteeProfilestate = {
  response: undefined,
  status: currentStatus.idle,
};

const sliceProfile = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getmentorprofile.pending, (state, action) => {
        state.status = currentStatus.loading;
      })
      .addCase(getmentorprofile.fulfilled, (state, action) => {
        try {
          if ('name' in action.payload) {
            console.log(action.payload);
            state.response = MentorProfileImpl.fromJSON(
              JSON.stringify(action.payload),
            ) as MentorProfiletype;
          }
          state.status = currentStatus.success;
        } catch (error) {
          console.error('mentee/profile error: ', error);
          state.status = currentStatus.failed;
        }
      })
      .addCase(getmentorprofile.rejected, (state, action) => {
        state.status = currentStatus.failed;
      })
      .addCase(updateMentorProfileData.fulfilled, (state, action) => {
        try {
          console.log(`action payload is ${JSON.stringify(action.payload)}`);
          state.response = MentorProfileImpl.fromJSON(
            JSON.stringify(action.payload),
          ) as MentorProfiletype;
          console.log("json response is ",JSON.stringify(state.response))

          state.status = currentStatus.success;
        } catch (error) {
          console.error('mentee/profile error: ', error);
          state.status = currentStatus.failed;
        }
      })
      .addCase(updateMentorProfileData.rejected, (state, action) => {
        state.status = currentStatus.failed;
      })
      .addCase(updateMentorprofileskill.fulfilled, (state, action) => {
        try {
          state.response = MentorProfileImpl.fromJSON(
            JSON.stringify(action.payload),
          ) as MentorProfiletype;
          state.status = currentStatus.success;
        } catch (error) {
          console.error('mentee/profile error: ', error);
          state.status = currentStatus.failed;
        }
      })

      .addCase(updateMentorprofileskill.rejected, (state, action) => {
        state.status = currentStatus.failed;
      });
     
  },
});

export const getmentorprofile = createAsyncThunk('profile/get', async () => {
  try {
    const response = await apigetMentorProfile();
    console.log(
      `Response from mentee/profile screen the server is `,
      response['Skill set'],
    );

    const res: MentorProfiletype = MentorProfileImpl.fromJSON(
      JSON.stringify(response),
    ) as MentorProfiletype;
    console.log(`Response from mentee/profile  the server is `, res);
    return res.toJSON();
  } catch (error: any) {
    console.error('mentee/profile error: ', error);
    return {error: 'Unexpected response from server', status: error};
  }
});

export const updateMentorProfileData = createAsyncThunk(
  'profile/update',
  async ({
    name,
    designation,
    contact,
    exp,
    domain
  }: {
    name: string;
    designation: string;
    contact: string;
    exp: string;
    domain: string;
  }) => {
    const response = await apiUpdateMentorProfile(
      name,
      exp,
      designation,
      contact,
      domain,
    );
    if (response === 1) {
      const updatedProfile = await apigetMentorProfile();
      // console.log('Updated profile is ', updatedProfile);
      return updatedProfile;
    }
    throw new Error('Failed to update profile data');
  },
);

export const updateMentorprofileskill = createAsyncThunk(
  'profile/addSkill',
  async ({skill, level}: {skill: string; level: string}) => {
    // Call your API to add the new skill
    const response = await apiaddMentorProfileSkill(skill, level);
    if (response === 1) {
      const updatedProfile = await apigetMentorProfile( );
      return updatedProfile;
    }
    throw new Error('Failed to update skill');
  },
);

export default sliceProfile.reducer;
