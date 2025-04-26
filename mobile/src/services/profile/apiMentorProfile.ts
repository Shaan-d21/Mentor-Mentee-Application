import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

export const apigetMentorProfile = async () => {
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  console.log(`API get Mentor Profile call`);
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: 'application/json',
      token: storage.getString('token'),
    },
  });

  try {
    const response = await api.get('users/mentor/profile');
    console.log(`Response from Mentor/profile screen the server is `, response);
    console.log(`-------------------------------------------`, response.status);

    if (response.status == 200) {
      console.log(`-------------------------------------------`, response.data);
      return response.data;
    } else {
      console.log('Something went wrong');
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }
  } catch (error: any) {
    console.error('Mentor/profile error: ', error);
    // throw error;
  }
};

export const apiUpdateMentorProfile = async (
  name: string,
  exp: string,
  designation: string,
  contact: string,
  domain: string,
) => {
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  console.log(`API update Mentor Profile call`);
  console.log(`-------------------------------------------`);
  console.log(`-------------------------------------------`);
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Token: storage.getString('token'),
    },
  });

  try {
    const data = {
      name: name,
      designation: designation,
      exp: exp,
      contact: contact,
      domain_name: domain,
    };
    console.log(`data in the apiMentorProfile is ${JSON.stringify(data)}`);
    const response = await api.put('users/mentor/profile_creation', data);
    console.log(
      `Response from Mentor/profile update screen the server is `,
      response,
    );
    console.log(`-------------------------------------------`, response.status);
    if (response.status == 200) {
      console.log(`-------------------------------------------`, response.data);
      return 1;
    } else {
      console.log('Something went wrong');
      return 0;
    }
  } catch (error: any) {
    console.error('Mentor/profile update error: ', error);
    return 0;
  }
};
// export const apiaddMentorProfileSkill = async (skillName: string,proficiency:string) => {
type SkillMap = {
  [key: string]: number;
};
export const apiaddMentorProfileSkill = async (skills: SkillMap) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json', // Add this header
      Token: storage.getString('token'),
    },
  });

  try {
    const mappedSkills = Object.keys(skills).map(skillName => ({
      skill_name: skillName,
      proficiency: skills[skillName],
    }));

    const data = {
      skills: mappedSkills,
    };

    const response = await api.post('users/mentor/skills', data);
    if (response.status == 200) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error adding Mentor profile skill:', error);
    return 0;
  }
};
export const apiDeleteMentorProfileSkill = async (skillId: number) => {
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Token: storage.getString('token'),
    },
  });

  try {
    console.log("Deleting skill with ID:", skillId); // Debugging log

    // Pass the skillId in the request body or as a query parameter
    const response = await api.delete(`users/mentor/skill_delete
`, {
      data: { skill_id: skillId }, // Include skill_id in the request body
    });

    if (response.status === 200) {
      console.log(`Skill with ID ${skillId} deleted successfully.`);
      return 1; // Success
    } else {
      console.log('Failed to delete skill:', response.status);
      return 0; // Failure
    }
  } catch (error) {
    console.error('Error deleting mentee profile skill:', error);
    return 0; // Failure
  }
};
