import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./Dashboard"; // Import your new dashboard component

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
        <Dashboard /> {/* Load your new dashboard component */}
      </main>
    </div>
  );
};

export default DashboardPage;
