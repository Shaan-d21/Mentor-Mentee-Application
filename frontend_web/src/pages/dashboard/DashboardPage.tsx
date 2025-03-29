import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default () => {
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
  const handleLogout = () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (!isConfirmed) {
      return;
    }

    // Clear all authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Navigate to home page
    navigate("/");
  };
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {userInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">User Information</h2>
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Role:</strong> {userInfo.role}</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <p className="text-xl">Welcome to your dashboard!</p>
            <p className="text-gray-600 mt-2">You are now logged in to the application.</p>
          </div>
        </div>
      </div>
    </>
  );
};
