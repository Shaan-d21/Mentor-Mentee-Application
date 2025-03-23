import { useState } from "react";
import AuthLayout from "./AuthLayout";
import api from "~/config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userResiterEnpoint } from "~/config/enpoints";

export default () => {
  const [userType, setUserType] = useState<string>("mentee");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        api.post(userResiterEnpoint, {
          name: name,
          mail: email,
          pwd: password,
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

      // const response = await toastifyResponse;

      if (response.status === 200) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
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
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button
          type="submit"
          className="w-full p-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Register as {userType}
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
