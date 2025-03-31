import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userName] = useState("John Doe"); // Example user name

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Header Section */}
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Welcome, {userName}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Cards */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Profile</h3>
            <p className="text-gray-400">View and update your profile details.</p>
            <button
              onClick={() => navigate("/profile")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Go to Profile
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Mentorships</h3>
            <p className="text-gray-400">Manage your mentorship connections.</p>
            <button
              onClick={() => navigate("/mentorships")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Mentorships
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="text-gray-400">Update your account settings.</p>
            <button
              onClick={() => navigate("/settings")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;