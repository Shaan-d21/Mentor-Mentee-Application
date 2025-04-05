import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import api, { apiService } from "../../services/api";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Get user info from localStorage
      const userInfoStr = localStorage.getItem("userInfo");
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.role === "mentor") {
            navigate("/mentor/dashboard");
          } else {
            navigate("/mentee/dashboard");
          }
        } catch (e) {
          // If JSON parsing fails, clear local storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userInfo");
        }
      }
    }
  }, [navigate]);

  // Add a logout function to clear localStorage
  const clearLoginData = () => {
    console.log("Clearing all login data from localStorage");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token'); // Remove both token formats
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('profile_status');
    localStorage.removeItem('userInfo');
    setIsLoading(false);
  };

  // At the start of the component, check for profile completion issues
  useEffect(() => {
    // Check if user has a valid token but profile completion is failing
    const token = localStorage.getItem('accessToken');
    const profileStatus = localStorage.getItem('profile_status');
    const urlParams = new URLSearchParams(window.location.search);
    const hasError = urlParams.get('error') === 'profile';
    
    if (token && hasError) {
      // User is having issues with profile completion, clear data and ask to login again
      clearLoginData();
      toast.error("Please login again to fix profile issues");
    }
  }, []);

  const validateEmail = (email: string): string => {
    // Basic format check
    if (!email) return "Email is required";
    
    // Remove any whitespace
    email = email.trim();
    
    // Check for minimum length
    if (email.length < 5) return "Email is too short";
    
    // Comprehensive email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      setIsLoading(true);
      setError('');
      console.log('Submitting login request for:', email);
      
      // Create form data in the format FastAPI expects for OAuth2
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);
      
      // Use the direct API URL instead of proxy
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      // Log what we're sending
      console.log('Sending login request to:', `${apiUrl}/authentication/login`);
      console.log('With credentials:', { username: email.trim().toLowerCase() });
      
      // Make login request with form-urlencoded data
      const response = await axios.post(`${apiUrl}/authentication/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      // Log the entire response for debugging
      console.log('Login response:', response);
      console.log('Login response data:', response.data);
      
      // Extract user data from response
      const { access_token, role, user_name, status_code, profile_status } = response.data;
      
      // Save token without any prefix - FastAPI expects the raw token
      localStorage.setItem('accessToken', access_token);
      // Store user info
      localStorage.setItem('role', role || 'mentee');
      localStorage.setItem('name', user_name || 'User');
      localStorage.setItem('email', email.trim().toLowerCase());
      // Store profile status
      localStorage.setItem('profile_status', profile_status === true ? 'complete' : 'incomplete');
      
      // Log what we stored
      console.log('Stored user info in localStorage:', {
        token: access_token ? `${access_token.substring(0, 10)}...` : 'No token',
        role: role || 'mentee',
        name: user_name || 'User',
        email: email.trim().toLowerCase(),
        profile_status: profile_status === true ? 'complete' : 'incomplete'
      });
      
      toast.success(`Welcome back, ${user_name || 'User'}!`);
      
      // Redirect based on profile status and role
      if (profile_status !== true) {
        // Profile is incomplete, redirect to profile completion page
        navigate('/profile-completion');
      } else {
        // Profile is complete, redirect to dashboard
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'mentor') {
          navigate('/mentor/dashboard');
        } else {
          navigate('/mentee/dashboard');
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error:', error);
      
      if (!error.response) {
        console.log('No response received:', error.message);
        setError('Server not responding. Please try again later.');
        toast.error('Server not responding. Please try the proxy server.');
        return;
      }
      
      // Clear any previous login data to avoid conflicts
      clearLoginData();
      
      const status = error.response?.status;
      
      if (status === 401) {
        setError('Invalid credentials');
        toast.error('Invalid credentials');
      } else if (status === 403) {
        setError('Access denied');
        toast.error('Access denied');
      } else if (status === 422) {
        setError('Invalid login format. Please check your email and password.');
        toast.error('Invalid login format. Please check your email and password.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
        toast.error('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Login to your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please enter your credentials to continue
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                emailError ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm`}
              placeholder="Enter your email"
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                passwordError ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm pr-10`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-700 focus:ring-blue-700 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-700-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" className="font-medium text-blue-700 hover:text-blue-700">
              Register here
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
