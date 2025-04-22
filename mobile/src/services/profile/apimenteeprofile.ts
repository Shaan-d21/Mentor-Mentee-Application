import axios from "axios";
import { MMKV } from "react-native-mmkv";
import { Skill } from "../../types/MenteeProfileTypes";



const storage = new MMKV();
export const apigetMenteeProfile = async () => {


  const api = axios.create({
    // baseURL: process.env.API_URL,
    baseURL: process.env.API_URL,
    headers: {
      "accept": "application/json",
      "Token": storage.getString("token")
    },
  });

  try {
    console.log(`url: ${process.env.API_URL} AND THE TOKEN is: ${process.env.TOKEN}`)
    const response = await api.get("mentee/mentee/profile");
    console.log(`Response from mentee/profile screen the server is `, response);
    console.log(`-------------------------------------------`, response.status);

    if (response.status == 200) {
      // console.log(`apimenteeprofile api: `, response.data);
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


export const apiUpdateMenteeProfile = async (name: string, contact: string, designation: string) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'accept': 'application/json',
      "Content-Type": "application/json",
      "Token": storage.getString("token")
    },
  });

  try {
    const data = {
      "name": name,
      "designation": designation,
      "contact": contact,
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
export const apiaddMenteeProfileSkill = async (skillName: Skill[]) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: "application/json",
      'Content-Type': 'application/json',
      "Token": storage.getString("token")

      // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50ZWVzIiwiaWQiOjk3LCJyb2xlIjoibWVudGVlIiwiZXhwIjoxODYzNDEwNTU0fQ.zP8R7Jdt6av2i9HMKjSznjwVIiUDXXAXPBuqSMfj6uY"
    },
  });

  try {
    const data = {
      skills: skillName.map((skillName) => ({
        skill_name: skillName.name,
        proficiency: skillName.proficiency
      })),
    };
    const response = await api.post("mentee/mentee/skills", data);
    if (response.status !== 200) {
      return 0;
    }
    else {
      return 1;
    }
  } catch (error) {
    console.error("Error adding mentee profile skill:", error);
    return 0;
  }
};