import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from "./AuthLayout";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate input
    if (!email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.data && response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('user_name', response.data.user_name);
        localStorage.setItem('profile_status', response.data.profile_status ? 'complete' : 'incomplete');
        localStorage.setItem('email', email.trim().toLowerCase());
        localStorage.setItem('name', response.data.user_name);
        
        toast.success('Login successful');
        
        if (response.data.profile_status) {
          navigate(`/${response.data.role}/dashboard`);
        } else {
          navigate('/profile-completion');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
          case 404:
            toast.error('Invalid credentials');
            break;
          case 405:
            console.error('Method not allowed. Check if the endpoint supports POST method.');
            toast.error('An error occurred. Please try again.');
            break;
          default:
            toast.error('An error occurred. Please try again.');
        }
      } else if (err.request) {
        toast.error('Unable to connect to server. Please check your internet connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AuthLayout>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Login to your account</h1>
        <p className="mt-1 text-sm text-gray-600">
          Please enter your credentials to continue
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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

        <div>
          <div className="flex justify-end mb-2">
            <a 
              href="/auth/forgot-password" 
              className="text-sm font-medium text-orange-600 hover:text-orange-500 cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-700-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 ${
              loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" className="font-medium text-blue-700 hover:text-blue-700 cursor-pointer">
              Register here
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
