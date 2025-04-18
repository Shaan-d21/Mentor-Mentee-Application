import axios from 'axios';

const API_BASE_URL = 'http://181.214.44.15:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const getMentors = async () => {
//   const response = await api.get('/mentor/mentor/profile');
//   return response.data;
// };

// export const getMentorById = async (id: string) => {
//   const response = await api.get(`/mentor/mentor/profile/${id}`);
//   return response.data;
// };

// export const getMenteeRequests = async () => {
//   const response = await api.get('/mentee/Requests');
//   return response.data;
// };

// export const approveMenteeRequest = async (requestId: string) => {
//   const response = await api.post(`/mentor/approve-mentee/${requestId}`);
//   return response.data;
// };

// export const rejectMenteeRequest = async (requestId: string) => {
//   const response = await api.post(`/mentor/reject-mentee/${requestId}`);
//   return response.data;
// };

// export const getMentorMentees = async () => {
//   const response = await api.get('/mentor/get-approved-mentee');
//   return response.data;
// };

// export const getMenteeMentors = async () => {
//   const response = await api.get('/mentee/get-approved-mentor');
//   return response.data;
// };

// export const getRoadmaps = async () => {
//   const response = await api.get('/roadmap/roadmap');
//   return response.data;
// };

// export const getRoadmapById = async (id: string) => {
//   const response = await api.get(`/roadmap/roadmap/${id}`);
//   return response.data;
// };

// export const createRoadmap = async (data: any) => {
//   const response = await api.post('/roadmap/roadmap', data);
//   return response.data;
// };

// export const updateRoadmap = async (id: string, data: any) => {
//   const response = await api.put(`/roadmap/roadmap/${id}`, data);
//   return response.data;
// };

// export const deleteRoadmap = async (id: string) => {
//   const response = await api.delete(`/roadmap/roadmap/${id}`);
//   return response.data;
// };

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
    config.headers['Token'] = authToken;
    
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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response);
      throw error;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw error;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      throw error;
    }
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
    
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com' || 'http://localhost:8000';
    
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
      
      return await axios.post(`${API_BASE_URL}/users/register/User`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (error) {
      console.log("Form-data approach failed, trying with JSON...");
      
      // Fallback to JSON if form-data fails
      return await axios.post(`${API_BASE_URL}/users/register/User`, userData);
    }
  }
};

export default api;
export { apiService }; 