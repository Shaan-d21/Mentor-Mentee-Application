import axios from "axios";
import { MMKV } from "react-native-mmkv";

const storage= new MMKV();

export const apigetMentorProfile = async () => {
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  console.log(`API get Mentor Profile call`);
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
    const api = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "accept": "application/json",
            "token": storage.getString("token")
        },
    });
    
    try {
        const response = await api.get("users/mentor/profile");
console.log(`Response from Mentor/profile screen the server is `, response);
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
        console.error("Mentor/profile error: ", error);
        // throw error;
    }
};


export const apiUpdateMentorProfile = async (name: string, exp: string, designation: string, contact: string,domain:string) => {
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  console.log(`API update Mentor Profile call`);
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      'accept': 'application/json',
      "Token": storage.getString("token")
    },
  });

  try {
    const data = {
      "name": name,
      "designation": designation,
      "exp": exp,
      "contact": contact,
      "domain_name" : domain,
    };
    console.log(`data in the apiMentorProfile is ${JSON.stringify(data)}`)
    const response = await api.put("users/mentor/profile_creation", data);
    console.log(`Response from Mentor/profile update screen the server is `, response);
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
    console.error("Mentor/profile update error: ", error);
    return 0;
  }
}
export const apiaddMentorProfileSkill = async (skillName: string,proficiency:string) => {
    const api = axios.create({
      baseURL: "http://181.214.44.15:8080/",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json", // Add this header
        "Token": storage.getString("token"), 
      },
    });
  
    try {
      const data = {
        skills: [
          {
            skill_name: skillName,
            proficiency: Number(proficiency),
          },
        ],
      };
      const response = await api.post("users/mentor/skills", data);
      if (response.status == 200) {
        return 1;

    }
      else{
        return 0;

      }
    } catch (error) {
      console.error("Error adding Mentor profile skill:", error);
      return 0; }
  };