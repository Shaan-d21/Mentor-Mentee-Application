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
    if (!email) return "Email is required";
    
    email = email.trim();
    
    if (email.length < 5) return "Email is too short";
    if (email.length > 254) return "Email is too long";
    
    const emailRegex = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    
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
      // Prepare user data
      const userData = {
        name: name.trim(),
        mail: email.trim().toLowerCase(),
        pwd: password,
        role: userType
      };
      
      console.log("Registering user through API");
      
      // Use the API URL directly instead of proxy
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const registerResponse = await axios.post(`${apiUrl}/users/register/User`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (registerResponse && registerResponse.status === 200) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle CORS errors
      if (error.message && error.message.includes('Network Error')) {
        toast.error(
          "Network error connecting to the server. Please check if the backend server is running."
        );
      } else {
        const errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage);
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
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
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
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
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
            } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
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
              } rounded-lg bg-white focus:ring-2 focus:ring-blue-500`}
              value={password}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
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
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isSubmitting || !!emailError || !!passwordError || !!nameError}
        >
          {isSubmitting ? "Processing..." : `Register as ${userType}`}
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;