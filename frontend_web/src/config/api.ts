import axios from "axios";
import { apiUrl } from "~/lib/env";

const baseURL = apiUrl;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  Accept: "application/json",
  withCredentials: true,
  timeout: 15000, // 15 seconds global timeout
};

const api = axios.create({
  baseURL,
  ...axiosConfig,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
