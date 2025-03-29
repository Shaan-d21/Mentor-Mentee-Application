import axios from "axios";



export const apigetMenteeProfile = async () => {
  
    const api = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "Content-Type": "application/json",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50ZWUiLCJpZCI6OTMsInJvbGUiOiJtZW50ZWUiLCJleHAiOjE3NDMyNjI4NTJ9.ZopqHz1vzIgpf_E4CPvuEmVWsULtSUllOSDCW9gQKrs"
        },
    });
    
    try {
        console.log(process.env.API_URL)
        const response = await api.get("mentee/mentee/profile");
console.log(`Response from mentee/profile screen the server is `, response);
console.log(`-------------------------------------------`, response.status);

        if (response.status == 200) {
            console.log(`-------------------------------------------`, response.data);
              return response.data;
        }
        else {
            console.log('Something went wrong');
            return { error: "Unexpected response from server", status: response.status };
        }
    } catch (error: any) {
        console.error("mentee/profile error: ", error);
        throw error;
    }
};


export const apiUpdateMenteeProfile = async () => {
    const api = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "Content-Type": "application/json",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50ZWUiLCJpZCI6OTMsInJvbGUiOiJtZW50ZWUiLCJleHAiOjE3NDMyNTkyODB9.1Eysoj2FAUdRzS76jSoOxYvwlOWCtxnwNxzwfR-Pxzs"
        },
    });
    

    return 1;
}
export const apiaddMenteeProfileSkill = async () => {
    return 1;
}
