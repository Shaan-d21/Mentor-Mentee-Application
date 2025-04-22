import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

export const apiSendMentorRequest = async (credentials: {
  mentorId: number;
  domain: string;
}) => {
  const storage = new MMKV();

  const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      token: storage.getString('token'),
    },
  });

  try {
    const data = {
      mentor_id: credentials.mentorId,
      domain: credentials.domain,
    };

    const response = await api.post('mentee/mentorship', JSON.stringify(data));

    if (response.status === 200) {
      console.log(response.data);
      console.log(`apiSendMentorRequest: ${response.data}`);
      return response.data;
    } else {
      console.log('Something went wrong');
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }
  } catch (error) {
    console.error('Backend problem', error);
  }
};
