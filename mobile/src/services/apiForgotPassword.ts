import axios from "axios"


export const apiConfirmPassword= async(password: string)=>{
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            "Content-Type":"Application/json"
        }
    });

    try{
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const data={
            "password":password,
        }
        console.log(`Parameter for apiConfirmedPassword is: ${JSON.stringify(data)}`);
        // const response= await api.post("url", data);

        // if(response.status== 200){
        //     return response.data;
        // }
        // else{
        //     console.error("Password not changed");
        //     return null;
        // }

        return {
            "status_code": 200,
            "message":"Password changed"
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return null
    }
}

export const apiVerifyEmail= async(email: string)=>{
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            "Content-Type":"Application/json"
        }
    });

    try{
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const data={
            "email": email
        }
        console.log(`Parameters of apiVerifyUser is: ${JSON.stringify(data)}`);
        // const response= await api.post("url", data);

        // if(response.status== 200){
        //     return response.data;
        // }
        // else{
        //     console.error("User not found");
        //     return null;
        // }

        return {
            "status_code": 200,
            "message":"User found"
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return null

    }
}


export const apiVerifyOtp= async(email: string, otp: number)=>{
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            "Content-Type":"Application/json"
        }
    });

    try{
        await new Promise((resolve) => setTimeout(resolve, 6000));
        const data={
            "otp":otp,
            "email": email
        }
        console.log(`Parameters of apiVerifyOtp are: ${JSON.stringify(data)}`);
        // const response= await api.post("url", data);

        // if(response.status== 200){
        //     return response.data;
        // }
        // else{
        //     console.error("Otp not verified");
        //     return null;
        // }

        return {
            "status_code": 200,
            "message":"Otp Verified"
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return null

    }
}