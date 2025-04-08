import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetApprovedMentees, apiPostAssignRoadmap, apiPostGenerateRoadMap } from "../../services/apiRoadmap/apiGenerateRoadmapMentor";

enum currentStatus {
  idle = "idle",
  loading = "loading",
  success = "success",
  failed = "failed",
}

interface Mentee {
  id: number;
  name: string;
}

interface MentorRoadmapState {
  mentees: Mentee[];
  roadmap: string[] | null;
  roadmapId: string | null;
  assign: 0 | 1 ;
  status: currentStatus;
  error: string | null;
}

const initialState: MentorRoadmapState = {
  mentees: [],
  roadmap: null,
  assign: 0,
  roadmapId: null,
  status: currentStatus.idle,
  error: null,
};

// Async thunk to fetch approved mentees
export const fetchApprovedMentees = createAsyncThunk("mentorRoadmap/fetchMentees", async () => {
  try {
    const response = await apiGetApprovedMentees();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.object.map((item: any) => ({
      id: item.User.id,
      name: item.User.name,
    })); // Map response to extract id and name
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch mentees");
  }
});

// Async thunk to generate a roadmap
export const generateRoadmap = createAsyncThunk(
  "mentorRoadmap/generateRoadmap", async ({domain,id}:{domain: string,id:string}) => {
    try {
      const roadmaps =await apiPostGenerateRoadMap(domain,id); 
      
      return roadmaps;
    } catch (error: any) {
      throw new Error(error.message || "Failed to generate roadmap");
    }
  }
);

export const assignRoadmap = createAsyncThunk("mentorRoadmap/assignRoadmap", async ({menteeId,domainId,roadmapId}:{menteeId:string,domainId:string,roadmapId:string}) => {
  console.log("Assigning roadmap with ID:", roadmapId);

  try {
    console.log("Assigning roadmap with ID:", roadmapId);
    const response = await apiPostAssignRoadmap(menteeId,domainId,roadmapId); 
    console.log("Response from assign-roadmap:", response);
  if(response == 1){
    return response;
  }
  else{
    throw new Error("Failed to assign roadmap");}
  }
  catch (error: any) {
    throw new Error(error.message || "Failed to assign roadmap");
  }
}
);

const mentorRoadmapSlice = createSlice({
  name: "mentorRoadmap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch approved mentees
      .addCase(fetchApprovedMentees.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(fetchApprovedMentees.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.mentees = action.payload; // Store only id and name
      })
      .addCase(fetchApprovedMentees.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to fetch mentees";
      })

      // Generate roadmap
      .addCase(generateRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(generateRoadmap.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.error = null;
        console.log("Roadmap generated:", action.payload);
        state.roadmapId = action.payload.roadmap_id; 
        state.roadmap = action.payload.topics;
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to generate roadmap";
      }).addCase(assignRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(assignRoadmap.fulfilled, (state, action) => {
        state.status = currentStatus.success;
        state.error = null;
        console.log("Roadmap assigned:", action.payload);
        state.assign = 1; // Set assign to 1 on successful assignment
      })
      .addCase(assignRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to assign roadmap";
      }
      );
  },
});

export default mentorRoadmapSlice.reducer;