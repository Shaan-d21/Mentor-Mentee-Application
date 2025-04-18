import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

export const apiGetTopicsOnMentorScreen= async(roadmap_id: number)=>{
    const storage= new MMKV();
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            'Content-Type': "application/json",
            'Token': storage.getString("token")
        }
    });

    try{
        console.log("parameters: ", roadmap_id);
        const response= await api.get(`mentee/roadmap-topics/${roadmap_id}`);

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
        console.log("Internal server error", error);
        return null;
    }
}