import axios from "axios";


export const apiLoginUser = async (credentials: { email: string; password: string }) => {
    console.log(`API URL: ${process.env.API_URL}`);
    const api = axios.create({
        
        baseURL: process.env.API_URL,
        
        //  baseURL:"https://10b8-2a09-bac1-36a0-28-00-2a5-45.ngrok-free.app/",
        
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    
    try {
        console.log(`Axios: ${credentials.email} and ${credentials.password}`)
        const formData = new URLSearchParams();
        formData.append("username", credentials.email);
        formData.append("password", credentials.password);

        const response = await api.post("/authentication/login", formData.toString());

        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        }
        else {
            console.log('Something went wrong');
            return { error: "Unexpected response from server", status: response.status };
        }
    } catch (error: any) {
        console.error("Login error: ",error);
        throw error;
    }
};
