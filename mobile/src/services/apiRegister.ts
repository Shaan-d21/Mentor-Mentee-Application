import axios from "axios";



export const apiRegisterUser = async (credentials: { email: string; password: string; name: String; role: "admin" | "mentee" | "mentor" }) => {
  
    const api = axios.create({
        baseURL: process.env.API_URL,
        // baseURL: "https://081d-2a09-bac1-36c0-28-00-242-50.ngrok-free.app/",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    try {
        console.log(process.env.API_URL)
        console.log(`Axios: ${credentials.email} and ${credentials.password}`)
        const data = {
            name:credentials.name,
            mail:credentials.email,
            pwd: credentials.password,
            role:credentials.role
          }


        const response = await api.post("users/register/User", JSON.stringify(data));
console.log(`Response from register screen the server is `, response);
        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        }
        else {
            console.log('Something went wrong');
            return { error: "Unexpected response from server", status: response.status };
        }
    } catch (error: any) {
        console.error("Register error: ", error);
        throw error;
    }
};
