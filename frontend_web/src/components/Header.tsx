import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

interface HeaderProps {
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Fetch user info from backend
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
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${apiUrl}/user?email=${userInfo.email}`,
          {
            headers: { Token: `Bearer ${accessToken}` },
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

  // Close dropdown if clicking outside
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
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    toast((t) => (
      <div className="p-4">
        <p className="text-sm font-medium text-gray-800">
          Are you sure you want to logout?
        </p>
        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsLoggingOut(false);
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              localStorage.removeItem("email");
              localStorage.removeItem("profile_status");
              localStorage.removeItem("userInfo");
              
              setDropdownOpen(false);
              setIsLoggingOut(false);
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
      id: "logout-confirmation",
    });
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              {userRole === "mentor" ? "Mentor Dashboard" : "Mentee Dashboard"}
              <FontAwesomeIcon icon={faMugSaucer} className="text-blue-500 text-2xl" />
            </h1>
          </div>

          {/* Search Bar with Icon */}
          <div className="hidden md:flex items-center">
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search from courses..."
                className="border p-2 pl-4 pr-10 rounded-md w-full outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-all"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={userInfo?.profile_pic_url || "https://www.freeiconspng.com/thumbs/profile-icon-png/user-icons--download-14403-free--premium-icons-on-iconfinder-15.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border"
                />
                <span className="text-gray-700 font-medium">{userInfo?.name || "User"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  <ul className="py-2">
                    <li
                      onClick={handleViewProfile}
                      className="px-4 py-2 cursor-pointer transition-all text-gray-700 hover:bg-[#2D6A4F] hover:text-white flex items-center gap-2"
                    >
                      <FaUser className="w-4 h-4" />
                      View Profile
                    </li>
                    <li
                      onClick={handleChangePassword}
                      className="px-4 py-2 cursor-pointer transition-all text-gray-700 hover:bg-[#2D6A4F] hover:text-white flex items-center gap-2"
                    >
                      <FaCog className="w-4 h-4" />
                      Change Password
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 cursor-pointer transition-all text-red-500 hover:bg-[#2D6A4F] hover:text-white flex items-center gap-2"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 