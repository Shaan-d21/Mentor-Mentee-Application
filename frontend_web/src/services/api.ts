import axios from 'axios';

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 seconds timeout
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
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show access denied message
          console.error('Access denied');
          break;
        case 404:
          // Not found - show resource not found message
          console.error('Resource not found');
          break;
        case 405:
          // Method not allowed - show error message
          console.error('Method not allowed');
          break;
        case 500:
          // Server error - show server error message
          console.error('Server error');
          break;
        default:
          console.error('An error occurred:', error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Specialized functions for authentication
const apiService = {
  // Regular API for most requests
  api,
  
  // Login function using form-urlencoded data
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email.trim().toLowerCase());
    formData.append('password', password);
    
    return await axios.post(`${API_BASE_URL}/authentication/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  // Registration function
  register: async (userData: { name: string, mail: string, pwd: string, role: string }) => {
    const formData = new URLSearchParams();
    // Format name: trim spaces, replace multiple spaces with single space, and capitalize first letter of each word
    const formattedName = userData.name
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    formData.append('name', formattedName);
    formData.append('mail', userData.mail.trim().toLowerCase());
    formData.append('pwd', userData.pwd);
    formData.append('role', userData.role);
    
    return await axios.post(`${API_BASE_URL}/users/register/User`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
};

export default api;
export { apiService }; 