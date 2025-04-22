import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

export const apiCancelRequest = async ({mentorId}: {mentorId: number}) => {
  const storage = new MMKV();
  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      Token: storage.getString('token'),
    },
  });

  try {
    const response = await api.delete('mentee/cancel_request', {
      data: {
        mentor_id: mentorId,
      },
    });

    if (response.status === 200) {
      console.log('apiCancelRequest response:', response.data);
      return response.data;
    } else {
      throw new Error('Failed to cancel request.');
    }
  } catch (error) {
    console.error('Internal server error', error);
    throw error;
  }
};
