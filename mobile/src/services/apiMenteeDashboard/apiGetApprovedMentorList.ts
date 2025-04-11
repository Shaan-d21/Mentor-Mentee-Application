import axios from "axios";
import { MMKV } from "react-native-mmkv";

export const apiGetApprovedMentorList= async()=>{
    const storage= new MMKV();
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers: {
            'accept': 'application/json',
            'Token': storage.getString("token"),
            // 'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOYWluZXNoIiwiaWQiOjUxLCJyb2xlIjoibWVudGVlIiwiZXhwIjoxNzQ1NDkzMzgwfQ.qbHkM2-Cl9klHwl_f03fXOVBXHfjeYlYd-I2viq70AU',
        }
    });
    try {

        const response = await api.get("mentee/get-approved-mentors");
        console.log("Approved Mentors Response: ", response.data);

        if(response.status== 200){
            // console.log("apiGetApprovedMentorList: ", response);

            return response.data;
        }
        else {
          console.error('there is error in api');
          return null;
        }

        // if (response.data && Array.isArray(response.data.object)) {
        //   const mentors: Mentor[] = response.data.object.map((mentorData) => ({
        //     id: mentorData.id,
        //     name: mentorData.name,
        //     mail: mentorData.mail, // Changed email to mail here
        //     designation: mentorData.designation || 'N/A', // Handle null designation
        //     domain_name: mentorData.domain_name || 'N/A',
        //     exp: mentorData.exp || null, // Add experience
        //   }));
        //   setMentorList(mentors);
        // } else {
        //   setError('Failed to fetch mentors: Invalid data format'); // Set error message
        // }
      } catch (err: any) {
        console.error("Failed to fetch approved mentors:", err);
        return null;
        // setError('Failed to fetch mentors: ' + err.message); // Set error message
      }
}