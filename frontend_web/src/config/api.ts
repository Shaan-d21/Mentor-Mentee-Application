import axios from "axios";
import { apiUrl } from "~/lib/env";

const baseURL = apiUrl;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
  },
  Accept: "application/json",
  withCredentials: true,
  timeout: 30000, // 30 seconds global timeout
};

const api = axios.create({
  baseURL,
  ...axiosConfig,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message);
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    }
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;
