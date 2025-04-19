// import axios from 'axios';
// import {MMKV} from 'react-native-mmkv';

// const storage = new MMKV();
// const api = axios.create({
//   // baseURL: process.env.API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     token: storage.getString('token'),
//   },
// });

// export const apiFetchReport = async (credentials: {
//   mentorId: number;
//   domain: string;
//   score: number;
// }) => {
//   try {
//     console.log(`Domain Passed to apiFetchReport: ${credentials.domain}`);

//     const data = {
//       domain: credentials.domain,
//       mentor_id: credentials.mentorId,
//       score: credentials.score,
//     };
//     console.log('Request Data:', data); // Debugging log to verify request data

//     const response = await api.post(
//       'https://mm-ai.shaandewang.publicvm.com/matching_report',
//       JSON.stringify(data),
//       {
//         headers: {
//           accept: 'application/json',
//           'Content-Type': 'application/json',
//           token: storage.getString('token'),
//         },
//       },
//     );
//     console.log('Raw API Data:', response.data);

//     if (response.status === 200) {
//       console.log('Report fetched successfully:', response.data);
//       return {
//         score: response.data.score || 0,
//         existingSkills: response.data.e_skills || [],
//         missingSkills: response.data.m_skills || [],
//         summary: response.data.summary || '',
//         domain: credentials.domain,
//       };
//     } else {
//       console.error('Unexpected response status:', response.status);
//       return {
//         error: 'Unexpected response from server',
//         status: response.status,
//       };
//     }
//   } catch (error: any) {
//     console.error('Error fetching report:', error);
//     return {error: 'Request failed', details: error};
//   }
// };

// /api/postMatchingReport.ts
import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

interface ReportPayload {
  mentor_id: number;
  domain: string;
  score: number;
}

export const apiFetchReport = async (payload: ReportPayload) => {
  const storage = new MMKV();

  try {
    console.log('Posting to Matching Report API with:', payload);

    const response = await axios.post(
      'https://mm-ai.shaandewang.publicvm.com/matching_report',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          token: storage.getString('token'), // Optional if needed
        },
      },
    );

    console.log('Matching Report Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error posting to Matching Report:', error);
    return null;
  }
};
