
import axios from 'axios';
import {AnimatableNumericValue} from 'react-native';
import {MMKV} from 'react-native-mmkv';

export const getPendingRequest = async () => {
  const storage = new MMKV();
  const token = storage.getString('token');
  console.log('Retrieved token:', token);

  const api = axios.create({
    baseURL: process.env.API_URL,
    //  baseURL:"https://8984-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/" ,
    headers: {
      accept: 'application/json',
      //token: storage.getString('token'),
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50b3IxIiwiaWQiOjM3LCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjIzNTY2fQ.JjPf6Xwa5GDOlWRNdu27Vx3DHYUrFQlGgwwhG-nP4zA',
    },
  });
  try {
    //const response = await api.get('/mentor/get-requests');
    const response = await api.get(
      'http://181.214.44.15:8080/mentor/get-requests',
    );

    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error('Error error to fetch pending requests: ', error);
    throw error;
  }
};

export const getApprovedMentees = async () => {
  const storage = new MMKV();
  const api = axios.create({
    baseURL: process.env.API_URL,
    //  baseURL:"https://8984-2a09-bac5-3b0b-1a46-00-29e-ff.ngrok-free.app/" ,
    headers: {
      accept: 'application/json',
      // token: storage.getString('token'),
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50b3IxIiwiaWQiOjM3LCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjIzNTY2fQ.JjPf6Xwa5GDOlWRNdu27Vx3DHYUrFQlGgwwhG-nP4zA',
    },
    // "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmFqd2FsIiwiaWQiOjQsInJvbGUiOiJtZW50b3IiLCJleHAiOjE4NjM0MTI0OTd9.EBsGs3SQXqtqJDkKgHHWdi0VI27cqDHjg1ZQg4RRHCI"}
  });
  try {
    //const response = await api.get('/mentor/get-approved-mentee');
    const response = await api.get(
      'http://181.214.44.15:8080/mentor/get-approved-mentee',
    );
    console.log(response);
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
    baseURL: '',
    headers: {
      accept: 'application/json',
      //token: storage.getString('token'),
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZW50b3IxIiwiaWQiOjM3LCJyb2xlIjoibWVudG9yIiwiZXhwIjoxNzQ1MjIzNTY2fQ',
    },
    // "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcmFqd2FsIiwiaWQiOjQsInJvbGUiOiJtZW50b3IiLCJleHAiOjE4NjM0MTI0OTd9.EBsGs3SQXqtqJDkKgHHWdi0VI27cqDHjg1ZQg4RRHCI"
  });
  try {
    console.log(process.env.API_URL);
    const response = await api.put(
      'http://181.214.44.15:8080/mentor-approval/approve-mentee',
      {
        approved: true,
        mentee_id: menteeId,
        status: status,
        comment: comment,
      },
    );
    console.log('Response from approveRejectMentee:', response);
    return response.data;
  } catch (error: any) {
    console.error(' Failed to approve or reject mentee: ', error);
    throw error;
  }
};
