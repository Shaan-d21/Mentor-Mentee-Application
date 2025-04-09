
import axios from 'axios';
import {AnimatableNumericValue} from 'react-native';
import {MMKV} from 'react-native-mmkv';

export const getPendingRequest = async () => {
  const storage = new MMKV();
  const token = storage.getString('token');
  console.log('Retrieved token:', token);

  const api = axios.create({
    //baseURL: process.env.API_URL,
    baseURL: 'http://181.214.44.15:8080',

    //  baseURL:"https://8984-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/" ,
    headers: {
      accept: 'application/json',
      Token: storage.getString('token'),
    },
  });
  try {
    //const response = await api.get('/mentor/get-requests');
    const response = await api.get('/mentor/get-requests');

if(response.status == 200) {
  console.log(response);
  return response.data;

    }
    else {
      console.error('Unexpected response status:', response.status);
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }


} catch (error: any) {
    console.error('Error error to fetch pending requests: ', error);
    throw error;
  }
};

export const getApprovedMentees = async () => {
  const storage = new MMKV();
  const api = axios.create({
    baseURL: 'http://181.214.44.15:8080',
    //  baseURL:"https://8984-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/" ,
    headers: {
      accept: 'application/json',
      Token: storage.getString('token'),
    },
  });

  try {
    //const response = await api.get('/mentor/get-approved-mentee');
    const response = await api.get('/mentor/get-approved-mentee');
    console.log('--Response from get-approved-mentee:', response);
    if (response.status == 200) {
      console.log('Response from get-approved-mentee:', response.data);
    } else {
      console.error('Unexpected response status:', response.status);
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }

    return response.data;
  } catch (error: any) {
    console.error('Error error to fetch approved mentees: ', error);
    throw error;
  }
};

// export const approveMentee = async (menteeId:string) => {
export const approveRejectMentee = async (
  menteeId: number,
  status: string,
  comment: string,
) => {
  const storage = new MMKV();

  const api = axios.create({
    baseURL: 'http://181.214.44.15:8080',
    headers: {
      accept: 'application/json',
      Token: storage.getString('token'),
      'Content-Type': 'application/json'
      // token:
      //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50b3IxIiwiaWQiOjM3LCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjIzNTY2fQ',
    },
  });
  try {
    console.log(process.env.API_URL);
    const response = await api.put('/mentor-approval/approve-mentee', {
      status: status,
      mentee_id: menteeId,
      comment: comment,
    });
    console.log('Response from approve-reject-mentee:', response); 
    if(response.status === 200) {
      console.log('Response from approve-reject-mentee:', response.data);
    return response.data;
    }
    else {
      console.error('Unexpected response status:', response.status);
      return {
        error: 'Unexpected response from server',
        status: response.status,
      };
    }

  } catch (error: any) {
    console.error(' Failed to approve or reject mentee: ', error);
    throw error;
  }
};
