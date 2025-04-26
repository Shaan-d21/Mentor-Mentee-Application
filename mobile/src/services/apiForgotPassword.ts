import axios from "axios"


export const apiConfirmPassword= async(email:string ,password: string)=>{
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            "Content-Type":"Application/json"
        }
    });

    try{
        const data={
            "mail":email,
            "pwd":password,
        }
        console.log(`Parameter for apiConfirmedPassword is: ${JSON.stringify(data)}`);
        const response= await api.patch("OTP/change_password", data);

        if(response.status== 200){
            return response.data;
        }
        else{
            console.error("Password not changed");
            return response.data;
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return {
            status_code:500,
            message:"Internal Serever Error"
        };
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
        console.log(`Parameters of apiVerifyUser is: ${email}`);
        const response= await api.get(`verification/otp?mail=${email}`);

        if(response.status== 200){
            return response.data;
        }
        else{
            console.error("User not found");
            return response.data;
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return {
            status_code:500,
            message:"Internal Server Error"
        };
    }
}


export const apiVerifyOtp= async(email: string, otp: string)=>{
    const api= axios.create({
        baseURL: process.env.API_URL,
        headers:{
            "Content-Type":"Application/json"
        }
    });

    try{
        const data={
            "otp":otp,
            "mail": email
        }
        console.log(`Parameters of apiVerifyOtp are: ${JSON.stringify(data)}`);
        const response= await api.post("verification/verify-otp", data);

        if(response.status== 200){
            return response.data;
        }
        else{
            console.error("Otp not verified");
            return response.data;
        }

        
    }catch(error){
        console.error("Internal Server Error ", error);
        return {
            status_code:500,
            message:"Internal Serever Error"
        };
    }
}