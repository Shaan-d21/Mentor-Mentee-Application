import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthLayout from "./AuthLayout";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send GET request with mail as query parameter
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/verification/otp`,
        {
          params: {
            mail: email.trim().toLowerCase(),
          },
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      // Check response data for success
      if (response.status === 200 && response.data.status_code === 200) {
        toast.success("Password reset OTP has been sent to your email!");
        navigate("/otp-verification", { state: { email: email.trim().toLowerCase() } });
      } else {
        toast.error(response.data.Message || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Email not found. Please check your email address.");
            break;
          case 400:
            toast.error(error.response.data.Message || "An error occurred while sending OTP.");
            break;
          default:
            toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Unable to connect to server. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your email address and we'll send you an OTP to reset your password
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
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-700 focus:border-blue-700 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 ${
              loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/auth/login" className="font-medium text-blue-700 hover:text-blue-700 cursor-pointer">
              Login here
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;