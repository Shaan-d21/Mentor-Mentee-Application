import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

export const apiGetRequests = async () => {
  const storage = new MMKV();

  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      Token: storage.getString('token'),
    },
  });
  try {
    const response = await api.get('mentee/Requests');
    if (response.status == 200) {
      console.log('apiFetchApprovedDomain: ', response.data);
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('Internal server error ', error);
  }
};
