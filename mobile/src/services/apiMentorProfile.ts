import axios from "axios";



export const apigetMentorProfile = async () => {
    const api = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            "accept": "application/json",
            "token": process.env.TOKEN
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


export const apiUpdateMentorProfile = async (name: string, exp: string, github_id: string, contact: string, gender: string) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Content-Type": "application/json",
      "token": process.env.TOKEN
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

    const response = await api.put("/users/mentor/profile_creation", data);
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
      baseURL: process.env.API_URL,
      headers: {
        accept: "application/json",
        token:
        process.env.TOKEN,
      },
    });
  
    try {
      const data = {
        skills: [
          {
            skill_name: skillName,
            proficiency: proficiency,
          },
        ],
      };
      const response = await api.post("users/mentor/skills", data);
      if (response.status !== 200) {
  return 0;
    }
      else{
        return 1;
      }
    } catch (error) {
      console.error("Error adding Mentor profile skill:", error);
      return 0; }
  };