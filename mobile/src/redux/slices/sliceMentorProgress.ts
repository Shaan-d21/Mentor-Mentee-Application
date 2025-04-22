import { createAsyncThunk, createSlice, current, isRejectedWithValue } from "@reduxjs/toolkit";
import { apiGetTopicsOnMentorScreen } from "../../services/apiFeedback/apiFeedbackMentor/apiGetTopicsOnMentorScreen";
import { apiReassignTopic } from "../../services/apiFeedback/apiFeedbackMentor/apiReassignTopic";
import { apiCompleteTopic } from "../../services/apiFeedback/apiFeedbackMentor/apiCompleteTopic";

enum currentStatus { idle = "idle", loading = "loading", success = "success", failed = "failed" }

interface Topic {
    description: string,
    importance: string,
    name: string,
    topic_id: number,
    topic_status: string,
    subtopics: String[];
}

//State of the redux
interface State {
    roadMapId: number | null,
    roadmapExplanation: string | null;

    completedTopics: Topic[],
    assignedTopics: Topic[],
    markedTopics: Topic[],

    status: currentStatus,
}

const initialState: State = {
    roadMapId: null,
    roadmapExplanation: null,

    completedTopics: [],
    assignedTopics: [],
    markedTopics: [],

    status: currentStatus.idle,
}

// API response
interface FetchRoadmapResponse {
    topics: Topic[];
    roadmapExplanation: string;
    roadMapId: number;

}

//Fetch the list of the topics present in the roadmap
export const fetchRoadmap = createAsyncThunk<FetchRoadmapResponse, number, { rejectValue: string }>("mentorProgress/fetchRoadmap", async (roadmap_id, { rejectWithValue }) => {
    const response = await apiGetTopicsOnMentorScreen(roadmap_id);
    // console.log("response from the fetchRoadmap async thunk is", response);

    if (!response) {
        return rejectWithValue("No data returned from API");
    }

    // console.log("fetchRoamap asyncThunk: ", response);
    return {
        topics: response.topics,
        roadmapExplanation: response.roadmap_explanation,
        roadMapId: response.roadmap_id
    };
})

//Reassigning the task to the mentee4
export const reassignTopic = createAsyncThunk<{ message: string; status_code: number }, { topic_id: number; mentee_id: number; feedback: string }, { rejectValue: string }>("mentorProgress/reassignTopic", async ({ topic_id, mentee_id, feedback }, { rejectWithValue }) => {
    console.log(topic_id, mentee_id, feedback);
    const response = await apiReassignTopic(topic_id, mentee_id, feedback);
    console.log("the response from the reassignTopic asyncThunk is: ", response);

    if (!response) {
        return rejectWithValue("No data returned form API");
    }

    return response;
});

//Approving the competion of the task marked by the mentee
export const completeTopic = createAsyncThunk<{ message: string; status_code: number }, { topic_id: number; mentee_id: number; feedback: string }, { rejectValue: string }>("mentorProgress/completeTopic", async ({ topic_id, mentee_id, feedback }, { rejectWithValue }) => {
    console.log(topic_id, mentee_id, feedback);
    const response = await apiCompleteTopic(topic_id, mentee_id, feedback);
    console.log("the response from the reassignTopic asyncThunk is: ", response);

    if (!response) {
        return rejectWithValue("No data returned form API");
    }

    return response;
});

// export const 
const sliceMentorProgress = createSlice({
    name: "mentorProgress",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRoadmap.rejected, (state, action) => {
            state.status = currentStatus.failed;
            console.error("Failed to fetch roadmap:", action.payload);
        }).addCase(fetchRoadmap.pending, (state) => {
            state.status = currentStatus.loading;
        }).addCase(fetchRoadmap.fulfilled, (state, action) => {
            console.log("reducer content is ", action.payload);
            state.status = currentStatus.success;

            state.assignedTopics = action.payload.topics.filter(topic => topic.topic_status === "assigned");
            state.completedTopics = action.payload.topics.filter(topic => topic.topic_status === "completed");
            state.markedTopics = action.payload.topics.filter(topic => topic.topic_status === "marked");

            state.roadMapId = action.payload.roadMapId;
            state.roadmapExplanation = action.payload.roadmapExplanation;

            console.log("assigned topics are ", state.assignedTopics);
            console.log("completed topics are ", state.completedTopics);
            console.log("marked topics are ", state.markedTopics);
            // console.log("roadmap id is ", state.roadMapId);
            // console.log("roadmap Explanation is", state.roadmapExplanation);
        })

            //for the reassign of the topic: move from markedtTopics to assignedTopics
            .addCase(reassignTopic.rejected, (state, action) => {
                state.status = currentStatus.failed;

            }).addCase(reassignTopic.pending, (state, action) => {
                state.status = currentStatus.loading;

            }).addCase(reassignTopic.fulfilled, (state, action) => {
                const { topic_id } = action.meta.arg;

                const topicIndex = state.markedTopics.findIndex(
                    (topic) => {
                        if(topic.topic_id=== topic_id)
                        console.log("The topic that is moved from marked to assigned is", topic);
                        return (topic.topic_id === topic_id);
                    }
                );
                // console.log("the removedTopic is", removeTopic)
                if (topicIndex !== -1) {
                    const [removedTopic] = state.markedTopics.splice(topicIndex, 1);

                    removedTopic.topic_status = 'assigned';
                    // Add the topic to assignedTopics
                    state.assignedTopics.push(removedTopic);
                }
            })

            //for the completion of the topic: move the topic from completedTopics to markedTopics
            .addCase(completeTopic.rejected, (state, action) => {
                state.status = currentStatus.failed;

            }).addCase(completeTopic.pending, (state, action) => {
                state.status = currentStatus.loading;

            }).addCase(completeTopic.fulfilled, (state, action) => {
                const { topic_id } = action.meta.arg;

                const topicIndex = state.markedTopics.findIndex(
                    (topic) => topic.topic_id === topic_id
                );
                if (topicIndex !== -1) {
                    const [removedTopic] = state.markedTopics.splice(topicIndex, 1);

                    removedTopic.topic_status = 'completed';
                    // Add the topic to completedTopics
                    state.completedTopics.push(removedTopic);
                }

            })
    }
});

export default sliceMentorProgress.reducer;