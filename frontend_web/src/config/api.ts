import axios from "axios";

const baseURL = "http://localhost:8000"; // FastAPI backend URL

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

// Add request interceptor for authentication and debugging
api.interceptors.request.use(
  (config) => {
    // Add authentication token to all requests
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Token = `Bearer ${token}`;
    }
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
      
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
