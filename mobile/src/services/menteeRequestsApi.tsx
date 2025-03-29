import axios from "axios";


export const getMenteeRequests = async () => {
    const api = axios.create({
        baseURL: "https://10b8-2a09-bac1-36a0-28-00-2a5-45.ngrok-free.app",
        headers:{
                
            "accept": "application/json",
            "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb290IiwiaWQiOjgzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQzMjYzODM2fQ.YkG6QDRttzc5s-5h_pEbsh2SnZ9hOLYt1hk9ef51qn4"}
        }
        
    );
    try {
        const response = await api.get("/mentor/get-requests");
        console.log(response);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching mentee requests: ", error);
        throw error;
    }
};

export const approveMentee = async (menteeId: string) => {
    const api = axios.create({
        baseURL: "https://10b8-2a09-bac1-36a0-28-00-2a5-45.ngrok-free.app",
        headers:{
                
            "accept": "application/json",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb290IiwiaWQiOjgzLCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQzMjYzODM2fQ.YkG6QDRttzc5s-5h_pEbsh2SnZ9hOLYt1hk9ef51qn4"
    }
        });
    try {
        const response = await api.put("/mentor-approval/approve-mentee", {      
            approved: true,
            mentee_id:menteeId,
      });
        return response.data;
    } catch (error: any) {
        console.error("Error approving mentee: ", error);
        throw error;
    }
};