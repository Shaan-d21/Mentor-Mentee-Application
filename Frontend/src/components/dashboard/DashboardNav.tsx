import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

interface DashboardNavProps {
  userRole: 'mentor' | 'mentee';
}

const DashboardNav: React.FC<DashboardNavProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/auth/login");
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoString);
        const response = await axios.get(
          `http://localhost:8000/api/v1/user?email=${userInfo.email}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Error fetching user information");
        navigate("/auth/login");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast((t) => (
      <div className="p-4">
        <p className="text-sm font-medium text-gray-800">
          Are you sure you want to logout?
        </p>
        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userInfo");
              toast.dismiss(t.id);
              toast.success("Logged out successfully!");
              navigate("/auth/login");
            }}
            className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
    });
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {userRole === "mentor" ? "Mentor Dashboard" : "Mentee Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search from courses..."
                className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userInfo?.profile_pic_url || "https://www.freeiconspng.com/thumbs/profile-icon-png/user-icons--download-14403-free--premium-icons-on-iconfinder-15.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <span className="text-sm font-medium text-gray-700">{userInfo?.name || "User"}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleViewProfile}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaUser className="mr-3 h-4 w-4 text-gray-400" />
                    View Profile
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaCog className="mr-3 h-4 w-4 text-gray-400" />
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-red-400" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav; 