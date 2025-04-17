
import axios from 'axios';

import { MMKV } from 'react-native-mmkv';

interface Feedback {
  mentee_id: number;
  mentor_id: number;
  domain_id: number;
  feedback: string;
  mentor_name: string;
  domain_name: string;
  feedback_id:number;
}

interface FeedbackResponse {
  status_code: number;
  Message: string;
  "Feedback List": Feedback[];
}
interface AnalysisResponse {
    status_code: number;
    message: string;
    data: {
      "feedback id": number;
      "key takeaways": string[];
      "improvement areas": string[];
      "action items": string[];
    };
  }
const storage = new MMKV();

export const fetchMenteeFeedback = async (): Promise<Feedback[]> => {
  try {
    const token = storage.getString('token');
    const response = await axios.get<FeedbackResponse>(`${process.env.API_URL}feedbacks/view`, {
      headers: {
        'accept': 'application/json',
        'Token': token,
      },
    });
    console.log(response.data);
    return response.data["Feedback List"];
   
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

export const summarizeFeedbackAPI = async (feedback: string): Promise<string> => {
    try {
      const response = await axios.post('http://181.214.44.15:8003/summarize',
       { text:feedback }, 
       {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const summaryText: string = response.data;
      return summaryText;
    } catch (error: any) {
      console.error('Error in summarizeFeedbackAPI:', error);
      throw error;
    }
};

export const analyzeFeedbackAPI = async (menteeId: number, feedbackId: number): Promise<AnalysisResponse> => {
    try {
      const response = await axios.get<AnalysisResponse>(
        `http://181.214.44.15:8003/mentee/feedback/${menteeId}/${feedbackId}`,
        {
          headers: {
            'accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in analyzeFeedbackAPI:', error);
      throw error;
    }
  };