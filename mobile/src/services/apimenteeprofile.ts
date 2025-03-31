import axios from "axios";



export const apigetMenteeProfile = async () => {
    

    const api = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJpZCI6MSwicm9sZSI6Im1lbnRlZSIsImV4cCI6MTg2MzM0MTU4MH0.EK7Pm7YyBBKdBWvi7yQ4U_5X11Vb5uZWY0fCjiYkI8s"
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
        // throw error;
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
export const apiaddMenteeProfileSkill = async (skillName: string) => {
    const api = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmciLCJpZCI6MSwicm9sZSI6Im1lbnRlZSIsImV4cCI6MTg2MzM0MTU4MH0.EK7Pm7YyBBKdBWvi7yQ4U_5X11Vb5uZWY0fCjiYkI8s",
        "Content-Type": "application/json",
      },
    });
  
    try {
      const data = {
        skills: [
          {
            skill_name: skillName,
            proficiency: 1,
          },
        ],
      };
      const response = await api.post("mentee/mentee/skills", data);
      if (response.status !== 200) {
  return 0;
    }
      else{
        return 1;
      }
    } catch (error) {
      console.error("Error adding mentee profile skill:", error);
      return 0; }
  };