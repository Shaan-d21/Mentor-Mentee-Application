import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

export const apiGetMentorList = async (credentials: {domain: string}) => {
  const storage = new MMKV();

  const api = axios.create({
    baseURL: "https://mm-ai.krishnamonani.publicvm.com/",
    headers: {
      'Content-Type': 'application/json',
      token: storage.getString('token'),
      // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50ZWUiLCJpZCI6OTMsInJvbGUiOiJtZW50ZWUiLCJleHAiOjE4NjM0MTM5ODF9.CwPoo4pXdkgVuyzF_701Cyp0nd4d0wZfZMBe7Loh4ug"
    },
  });

  try {
    console.log(`Credentials are ${credentials.domain}`);
    const data = {choise: credentials.domain};
    //request
    const response = await api.get('predict/', {params:{d: credentials.domain}});
    if (response.status == 200) {
      // console.log("apiGetMentorList response:", response);
      console.log(`apiGetMentorList data: `, response.data);
      return response.data;
    } else {
      console.error('there is error in api');
      return null;
    }
  } catch (error) {
    console.error('Server Error: ', error);
    return null;
  }
};
