import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

export const apiReassignTopic= async(topic_id: number, mentee_id: number, feedback: string)=>{
    const storage= new MMKV();
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            'Content-Type': 'application/json',
            'Token': storage.getString("token")
        }
    });

    try{
        const data={
            "topic_id": topic_id,
            "mentee_id": mentee_id,
            "feedback": feedback
        }
        const response= await api.put("progress/reassign_topic", data);
        
        if(response.status== 200){
            // console.log("response from the apiGetTopicsOnMentorScreen is ", response.data);
            // console.log("apiGetTopicsOnMentorScreen response: ",response.data);
            return response.data;
        }else{
            // console.log("No roadmap-topics found");
            // console.log(response);
            return null;
        }

    }catch(error){
        console.log("apiReassignTopic: Internal server error", error);
        return null;
    }
}