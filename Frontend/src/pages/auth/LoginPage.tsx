import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import api from "~/config/api";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateEmail = (email: string): string => {
    // Basic format check
    if (!email) return "Email is required";
    
    // Remove any whitespace
    email = email.trim();
    
    // Check for minimum length
    if (email.length < 5) return "Email is too short";
    
    // Check for maximum length
    if (email.length > 254) return "Email is too long";
    
    // Comprehensive email regex
    const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    
    // Additional specific checks
    if (email.includes('..')) return "Email cannot contain consecutive dots";
    if (email.includes('@.')) return "Invalid character after @";
    if (email.includes('.@')) return "Invalid character before @";
    if (email.split('@').length > 2) return "Email cannot contain multiple @ symbols";
    if (email.startsWith('.')) return "Email cannot start with a dot";
    if (email.endsWith('.')) return "Email cannot end with a dot";
    if (/@.*_/.test(email)) return "Domain cannot contain underscore";
    
    return "";
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    if (/\s/.test(password)) {
      return "Password cannot contain spaces";
    }
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
    if (isLoading) return;

    // Validate both email and password before submission
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) {
      setEmailError(emailValidationError);
      toast.error(emailValidationError);
      return;
    }

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error(passwordValidationError);
      return;
    }

    setIsLoading(true);
    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', email.trim().toLowerCase());
      formData.append('password', password);
      formData.append('scope', userType);

      console.log('Attempting login with:', { email, userType });

      const response = await toast.promise(
        api.post("/api/v1/authentication/login", formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 30000, // 30 second timeout for login
        }),
        {
          loading: "Logging in...",
          success: "Login successful!",
        }
      );

      console.log('Login response:', response.data);

      if (response.status === 200 && response.data.access_token) {
        // Save the token
        localStorage.setItem("accessToken", response.data.access_token);

        // Save user info
        const userInfo = {
          email: email.trim().toLowerCase(),
          role: userType,
          profileCompleted: false // This will be updated when profile is completed
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Navigate to appropriate page based on profile completion
        navigate("/profile-completion");
      }
    } catch (error: any) {
      console.error("Authentication failed:", error);
      console.error("Error response:", error?.response?.data);

      // Handle specific error messages from the backend
      const statusCode = error?.response?.status;
      const backendError = error?.response?.data?.detail;

      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please check your connection and try again.");
      } else if (statusCode === 404) {
        toast.error("User not found. Please register first.");
      } else if (statusCode === 403) {
        toast.error(backendError || "Access denied. Please check your credentials.");
      } else if (statusCode === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        console.error("Unexpected error details:", {
          status: statusCode,
          error: backendError,
          fullError: error
        });
        toast.error(backendError || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log in
        </h2>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
          disabled={isLoading}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 mb-1 border ${
              emailError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mb-4">{emailError}</p>
          )}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full p-3 mb-1 border ${
              passwordError ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-sm mb-4">{passwordError}</p>
        )}
        <button
          type="submit"
          className={`w-full p-3 text-white rounded-lg ${
            isLoading || emailError || passwordError
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-200`}
          disabled={isLoading || !!emailError || !!passwordError}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
};
