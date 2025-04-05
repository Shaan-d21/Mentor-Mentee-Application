import axios from 'axios';
import toast from 'react-hot-toast';

// Use environment variables or default to proxy server in development
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with improved config for CORS
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Keep this false to avoid triggering complex CORS requests
  timeout: 10000, // Add reasonable timeout
});

// Request interceptor to handle token
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem("accessToken");
  
  // Enhanced debugging
  console.log(`API Request to: ${config.url}`);
  console.log(`Method: ${config.method?.toUpperCase()}`);
  console.log(`Token available: ${token ? 'Yes' : 'No'}`);
  
  if (token) {
    // Log token format for debugging without revealing full token
    console.log(`Token format check: ${token.substring(0, 15)}...`);
    console.log(`Token length: ${token.length}`);
    
    // Add Bearer prefix - the backend expects this format
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers['Authorization'] = authToken;
    
    console.log(`Final auth header: ${authToken.substring(0, 20)}...`);
  }
  
  // Log all headers being sent
  console.log("Request headers:", config.headers);
  
  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => {
    // Success handler
    return response;
  },
  (error) => {
    // Error handler
    console.log("API Error:", error.response?.status, "-", error.response?.data || "Unknown error");
    console.log("URL:", error.config?.url);
    console.log("Request Headers:", error.config?.headers);
    
    // Handle common error cases
    if (!error.response) {
      console.log("Network error:", error.message);
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }
    
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 401) {
      console.log("Unauthorized: Token may be invalid or expired");
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('profile_status');
      window.location.href = '/auth/login';
    } else if (status === 403) {
      console.log("Forbidden: Insufficient permissions");
      toast.error("You don't have permission to access this resource");
    } else if (status === 404) {
      console.log("Not found:", error.config?.url);
      toast.error("Resource not found");
    } else if (status === 422) {
      console.log("Validation errors:", error.response.data.detail);
      toast.error("There was a problem with your request");
    } else if (status === 500) {
      console.log("Server error:", error.response.data);
      toast.error("Server error. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

// Add specialized functions for endpoints with CORS issues
const apiService = {
  // Regular API for most requests
  api,
  
  // Login function using form-urlencoded data
  login: async (username: string, password: string) => {
    console.log("Using form-urlencoded login method");
    
    const formData = new URLSearchParams();
    formData.append('username', username.trim().toLowerCase());
    formData.append('password', password);
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    return await axios.post(`${apiBaseUrl}/authentication/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  // Special registration function that avoids CORS preflight
  register: async (userData: { name: string, mail: string, pwd: string, role: string }) => {
    console.log("Using CORS-friendly registration method");
    
    // Try with form-data first
    try {
      const formData = new URLSearchParams();
      formData.append('name', userData.name.trim());
      formData.append('mail', userData.mail.trim().toLowerCase());
      formData.append('pwd', userData.pwd);
      formData.append('role', userData.role);
      
      return await axios.post(`${apiBaseUrl}/users/register/User`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (error) {
      console.log("Form-data approach failed, trying with JSON...");
      
      // Fallback to JSON if form-data fails
      return await axios.post(`${apiBaseUrl}/users/register/User`, userData);
    }
  }
};

export default api;
export { apiService }; 