import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from "react-hot-toast";

export default () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) return;

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
      }
    };

    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

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
              setIsAuthenticated(false);
              setIsMenuOpen(false);
              toast.dismiss(t.id);
              toast.success("Logged out successfully!");
              navigate("/");
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
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      // Navigate based on user role
      if (userInfo.role === 'mentor') {
        navigate('/mentor/profile');
      } else {
        navigate('/mentee/profile');
      }
    }
    setDropdownOpen(false);
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    if (userInfo?.role === "mentor") {
      navigate("/mentor/dashboard");
    } else {
      navigate("/mentee/dashboard");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {isAuthenticated && userInfo ? (
              <button
                onClick={handleDashboardClick}
                className="text-2xl font-bold text-white hover:text-gray-100 transition-colors duration-200"
              >
                {userInfo.role === "mentor" ? "Mentor Dashboard" : "Mentee Dashboard"}
              </button>
            ) : (
              <Link to="/" className="text-2xl font-bold text-white">
                Mentor-Mentee
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            {isAuthenticated ? (
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
                    <span className="text-sm font-medium text-white">{userInfo?.name || "User"}</span>
                    <svg
                      className={`w-4 h-4 text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
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
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-blue-800 to-blue-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search from courses..."
                      className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={handleViewProfile}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-blue-700"
                >
                  View Profile
                </button>
                <button
                  onClick={handleChangePassword}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-blue-700"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="block text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
