import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();
const api = axios.create({
  // baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    token: storage.getString('token'),
  },
});

export const apiFetchReport = async (credentials: {
  mentorId: number;
  domain: string;
  score: number;
}) => {
  try {
    const data = {
      domain: credentials.domain,

      mentor_id: credentials.mentorId,
      score: credentials.score,
    };

    const response = await api.post(
      'http://181.214.44.15:8003/matching_report',
      JSON.stringify(data),
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          token: storage.getString('token'),
        },
      },
    );

    if (response.status === 200) {
      console.log('Report fetched successfully:', response.data);
      return {
        score: response.data.score || 0,
        existingSkills: response.data.e_skills || [],
        missingSkills: response.data.m_skills || [],
        summary: response.data.summary || '',
      };
    } else {
      console.error('Unexpected response status:', response.status);
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }
  } catch (error: any) {
    console.error('Error fetching report:', error);
    return {error: 'Request failed', details: error};
  }
};
