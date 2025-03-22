import axios from "axios";
import { setUserType, setEmail, setPassword, setName } from '../redux/slices/authSlices';

const API_BASE_URL = "https://c59f-2a09-bac1-36c0-28-00-29e-fc.ngrok-free.app/docs#/authentication/login_for_access_token_authentication_login_post/";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    "Content-Type": "application/json",
    },
});

// Function to register a new user
export const signUpUser= async(credentials:{name: string, mail: string, pwd: string, role: string})=>{
    try{
        const response= await api.post("users/register/User", credentials);
        if(response.status==200){
            console.log("user inserted in the database");
            console.log(response.data);
            return response.data;
        }
        return {error:"Unexpected reseponse from server", status: response.status};
    } catch(error:any){
        console.log("Signup error: ", error.response?.data || error.message)
    }
}

// Function to login a user
export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await api.post("/authentication/login", credentials);

        if(response.status== 200){
            console.log(response.data);
            return response.data;
        }
        else{
            console.log('login user ke try mein ');
            return { error: "Unexpected response from server", status: response.status };
        }
    } catch (error:any) {
        console.error("Login error: ", error.response?.data || error.message);
        throw error; 
    }
};
