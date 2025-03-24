import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "~/config/api";
import toast from "react-hot-toast";
import { userLoginEnpoint } from "~/config/enpoints";

export default () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        api.post(userLoginEnpoint, {
          username: email,
          password: password,
          role: userType,
        }),
        {
          loading: "Loging...",
          success: (response) => {
            const errorMessage =
              response?.data?.message || "Logged in succesfully.";
            return <b>{errorMessage}</b>;
          },
          error: (error) => {
            const errorMessage =
              error?.response?.data?.error || "Something went wrong";
            return <b>{errorMessage}</b>;
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem("refresh_token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log in
        </h2>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a
          href="/auth/forgot-password"
          className="text-blue-500 hover:underline text-sm"
        >
          Forgot your password?
        </a>
        <button
          type="submit"
          className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </button>
        {userType !== "admin" && (
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};
