import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const RegisterPage: React.FC = () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): string => {
    // Basic format check
    if (!email) return "Email is required";
    
    // Remove any whitespace
    email = email.trim();
    
    // Check for minimum length
    if (email.length < 5) return "Email is too short";
    
    // Comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    
    // Check for repeated TLDs
    const domain = email.split('@')[1];
    const domainParts = domain.toLowerCase().split('.');
    if (domainParts.length >= 2 && domainParts[domainParts.length - 1] === domainParts[domainParts.length - 2]) {
      return "Invalid email domain";
    }

    // Check TLD length (must be 2 or 3 characters)
    const tld = domainParts[domainParts.length - 1];
    if (tld.length !== 2 && tld.length !== 3) {
      return "Domain extension must be 2 or 3 characters long";
    }
    
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    if (/\s/.test(password)) return "Password cannot contain spaces";
    return "";
  };

  const validateName = (name: string): string => {
    if (!name) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters long";
    if (name.includes("  ")) return "Name cannot contain consecutive spaces";
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name)) return "Name cannot contain numbers or special characters";
    if (name.trim() !== name) return "Name cannot start or end with spaces";
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setNameError(validateName(newName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all fields before submission
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const nameValidationError = validateName(name);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setNameError(nameValidationError);

    if (emailValidationError || passwordValidationError || nameValidationError) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare user data exactly as expected by the backend
      const userData = {
        name: name.trim(),
        mail: email.trim().toLowerCase(),
        pwd: password,
        role: userType.toLowerCase()
      };
      
      console.log("Registering user through API with data:", userData);
      
      // Use the direct backend URL with CORS headers
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register/User`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          withCredentials: true
        }
      );

      if (registerResponse && registerResponse.status === 200) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response) {
        if (error.response.status === 422) {
          // Handle validation errors
          const validationErrors = error.response.data?.detail;
          if (Array.isArray(validationErrors)) {
            const errorMessages = validationErrors.map(err => err.msg).join(', ');
            toast.error(`Validation error: ${errorMessages}`);
          } else if (typeof validationErrors === 'string') {
            toast.error(`Validation error: ${validationErrors}`);
          } else {
            toast.error("Invalid registration data. Please check your input.");
          }
        } else if (error.response.status === 400 || error.response.status === 500) {
          // Check for email already exists error in the response
          const errorMessage = error.response.data?.error || error.response.data?.detail;
          if (errorMessage?.includes('duplicate key value violates unique constraint "user_mail_key"') || 
              errorMessage?.includes('already exists')) {
            toast.error("This email is already registered. Please use a different email or login.");
          } else {
            toast.error("Invalid registration data. Please check your input.");
          }
        } else if (error.response.status === 409) {
          toast.error("This email is already registered. Please use a different email or login.");
        } else {
          toast.error("Registration failed. Please try again later.");
        }
      } else if (error.request) {
        toast.error("Cannot connect to the server. Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
          disabled={isSubmitting}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Full Name"
            className={`w-full p-3 border ${
              nameError ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            value={name}
            onChange={handleNameChange}
            disabled={isSubmitting}
            required
            minLength={2}
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>
        <div className="space-y-1 mt-4">
          <input
            type="email"
            placeholder="Email"
            className={`w-full p-3 border ${
              emailError ? "border-red-500" : "border-gray-300"
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer`}
            value={email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <div className="space-y-1 mt-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full p-3 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer`}
              value={password}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        <button
          type="submit"
          className={`w-full p-3 mt-6 text-white rounded-lg transition-colors duration-200 ${
            isSubmitting || emailError || passwordError || nameError
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
          disabled={isSubmitting || !!emailError || !!passwordError || !!nameError}
        >
          {isSubmitting ? "Processing..." : `Register as ${userType}`}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline cursor-pointer">
            Log In
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;