import axios from "axios";
import { MMKV } from "react-native-mmkv";


const storage= new MMKV();
export const apigetMenteeProfile = async () => {
    

    const api = axios.create({
        baseURL: "https://bdcf-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/",
        headers: {
            "accept": "application/json",
            "token": storage.getString("token")
        },
    });
    
    try {
        console.log("https://bdcf-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/")
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


export const apiUpdateMenteeProfile = async (name: string, exp: number, github_id: string, contact: string, gender: string) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      "token": storage.getString("token")
    },
  });

  try {
    const data = {
      "name": name,
      "exp": exp,
      "github_id": github_id,
      "contact": contact,
      "gender": gender
    };

    const response = await api.put("/mentee/mentee/profile_creation", data);
    console.log(`Response from mentee/profile update screen the server is `, response);
    console.log(`-------------------------------------------`, response.status);

    if (response.status == 200) {
      console.log(`-------------------------------------------`, response.data);
      return 1;
    }
    else {
      console.log('Something went wrong');
      return 0;
    }
  } catch (error: any) {
    console.error("mentee/profile update error: ", error);
    return 0;
  }
}
export const apiaddMenteeProfileSkill = async (skillName: string) => {
    const api = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        accept: "application/json",
        token:
        storage.getString("token"),
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