import axios from "axios";


export const getMenteeRequests = async () => {
    const api = axios.create({
         baseURL:process.env.API_URL ,
        //  baseURL:"https://8984-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/" ,
        headers:{
                
            "accept": "application/json",
            "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmFqd2FsIiwiaWQiOjQsInJvbGUiOiJtZW50b3IiLCJleHAiOjE4NjM0MTI0OTd9.EBsGs3SQXqtqJDkKgHHWdi0VI27cqDHjg1ZQg4RRHCI"}
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
        baseURL:process.env.API_URL,
                headers:{
                
            "accept": "application/json",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmFqd2FsIiwiaWQiOjQsInJvbGUiOiJtZW50b3IiLCJleHAiOjE4NjM0MTI0OTd9.EBsGs3SQXqtqJDkKgHHWdi0VI27cqDHjg1ZQg4RRHCI"
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