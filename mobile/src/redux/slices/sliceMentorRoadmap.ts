import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetApprovedMentees, apiPostAssignRoadmap, apiPostGenerateRoadMap } from "../../services/apiRoadmap/apiGenerateRoadmapMentor";
import { RoadmapResponse, roadmapResponseFromJson } from "../../types/RoadmapTypes";

enum currentStatus {
  idle = "idle",
  loading = "loading",
  success = "success",
  failed = "failed",
}

interface Mentee {
  id: number;
  name: string;
  domain_id: string;
  roadmapId?: string;
  domain_name: string;
}

interface MentorRoadmapState {
  mentees: Mentee[];
  roadmap: RoadmapResponse | null;
  roadmapId: string | null;
  status: currentStatus;
  error: string | null;
  assignStatus: 0|1 | null;
}

const initialState: MentorRoadmapState = {
  mentees: [],
  roadmap: null,
  roadmapId: null,
  status: currentStatus.idle,
  error: null,
  assignStatus: null,
};

// Async thunk to fetch approved mentees
export const fetchApprovedMentees = createAsyncThunk("mentorRoadmap/fetchMentees", async () => {
  try {
    const response = await apiGetApprovedMentees();
    if (response.error) {
      throw new Error(response.error);
    }
    return response.object.map((item: any) => ({
      id: item.id,
      name: item.name,
      domain_id: item.domain_id,
      domain_name: item.domain_name,
    }));
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch mentees");
  }
});



// Async thunk to generate a roadmap
export const generateRoadmap = createAsyncThunk(
  "mentorRoadmap/generateRoadmap", async ({domainId,id}:{domainId: string,id:string}) => {
    try {
      const roadmaps =await apiPostGenerateRoadMap(domainId,id); 
      console.log("generateRoadmap", roadmaps);
      if(roadmaps.status!== 200){
        throw new Error(roadmaps.toString() || "Failed to generate roadmap");
      }
      return roadmaps;
    } catch (error: any) {
      throw new Error(error.message.toString() || "Failed to generate roadmap");
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
  reducers: {
initialStateMentorRoadmap (state)  {
      state.mentees = [];
      state.roadmap = null;
      state.roadmapId = null;
      state.status = currentStatus.idle;
      state.error = null;
      state.assignStatus = null;
    }
  



  },
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
        console.log("Roadmap data:", action.payload);
        // @ts-ignore
        const roadmapData = action.payload.data;
        console.log("Roadmap data:", roadmapData);
        state.status = currentStatus.success;
        state.error = null;
        console.log("Roadmap generated:", action.payload);
        // state.roadmapId = action.payload.roadmap_id;
        state.roadmapId = roadmapData.roadmap_id;

      // state.roadmap= splitByNewLine(action.payload.roadmap_name);
        state.roadmap= roadmapResponseFromJson(roadmapData);
        console.log("Roadmap ID:", state.roadmapId);
        console.log("Roadmap name:", roadmapData.roadmap_name);
        
    console.log("Roadmap topics:", state.roadmap);
      })
      .addCase(generateRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to generate roadmap";
      }).addCase(assignRoadmap.pending, (state) => {
        state.status = currentStatus.loading;
        state.error = null;
      })
      .addCase(assignRoadmap.fulfilled, (state, action) => {
        state.status = currentStatus.idle;
        state.roadmap= null;
        state.roadmapId = null;
        state.error = null;
        state.assignStatus = action.payload == 1 ? 1 : 0;
        console.log("Roadmap assigned:", action.payload);

      })
      .addCase(assignRoadmap.rejected, (state, action) => {
        state.status = currentStatus.failed;
        state.error = action.error.message || "Failed to assign roadmap";
      }
      );
  },
});
export const { initialStateMentorRoadmap } = mentorRoadmapSlice.actions;
export default mentorRoadmapSlice.reducer;