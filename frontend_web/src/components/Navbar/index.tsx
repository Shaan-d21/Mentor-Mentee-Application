import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import toast from "react-hot-toast";

interface UserInfo {
  role?: string;
  name?: string;
  profile_pic_url?: string;
}

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      const name = localStorage.getItem("name");
      
      setIsAuthenticated(!!token);
      
      if (token) {
        setUserInfo({
          role: role || "mentee",
          name: name || "User"
        });
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [location.pathname]);

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
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    // Clear all items from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profile_status");
    localStorage.removeItem("userInfo");
    
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    setIsLoggingOut(false);
    setShowLogoutModal(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleViewProfile = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    const profileStatus = localStorage.getItem("profile_status");
    const token = localStorage.getItem("accessToken");
    
    console.log("View Profile clicked:", { role, profileStatus, token: token ? "exists" : "missing" });
    
    // Check if user is authenticated
    if (!token) {
      toast.error("Please log in to view your profile");
      navigate("/auth/login");
      setDropdownOpen(false);
      return;
    }
    
    // If profile is not complete, redirect to profile completion page
    if (profileStatus !== 'complete') {
      navigate("/profile-completion");
      toast.error("Please complete your profile first");
      setDropdownOpen(false);
      return;
    }
    
    try {
      // Check URL origin to ensure we're using the correct protocol, hostname and port
      const origin = window.location.origin;
      console.log("Current origin:", origin);
      
      // Directly navigate to dashboard profile without any conditionals
      if (role === "mentor") {
        console.log("Navigating to mentor profile");
        // Force a full page navigation to ensure clean state
        window.location.href = `${origin}/mentor/dashboard/profile`;
      } else if (role === "mentee") {
        console.log("Navigating to mentee profile");
        // Force a full page navigation to ensure clean state
        window.location.href = `${origin}/mentee/dashboard/profile`;
      } else {
        toast.error("Unable to determine user role");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Error navigating to profile");
    }
    
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDashboardClick = () => {
    const role = localStorage.getItem("role")?.toLowerCase();
    
    if (role === "mentor") {
      navigate("/mentor/dashboard");
    } else if (role === "mentee") {
      navigate("/mentee/dashboard");
    } else {
      navigate("/dashboard"); // This will redirect based on role
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-md">
      <div className="max-w-full mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-1">
            {isAuthenticated ? (
              <button
                onClick={handleDashboardClick}
                className="text-2xl font-bold text-white hover:text-gray-100 transition-colors duration-200 ml-0 sm:-ml-4"
              >
                Mentor-Mentee
              </button>
            ) : (
              <Link to="/" className="text-2xl font-bold text-white">
                Mentor-Mentee
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6 sm:mr-0 md:mr-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-3 focus:outline-none cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={userInfo?.profile_pic_url || "https://www.freeiconspng.com/thumbs/profile-icon-png/user-icons--download-14403-free--premium-icons-on-iconfinder-15.png"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-gray-200"
                    />
                    <span className="text-sm font-medium text-white cursor-pointer">{userInfo?.name || "User"}</span>
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
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <FaUser className="mr-3 h-4 w-4 text-gray-400" />
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
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
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center px-3 py-2 border-b border-blue-700">
                <img
                  src={userInfo?.profile_pic_url || "https://www.freeiconspng.com/thumbs/profile-icon-png/user-icons--download-14403-free--premium-icons-on-iconfinder-15.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-200 mr-3"
                />
                <span className="text-sm font-medium text-white">
                  {userInfo?.name || "User"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleViewProfile();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-blue-700 flex items-center"
              >
                <FaUser className="mr-3 h-4 w-4" />
                View Profile
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-red-200 hover:bg-blue-700 flex items-center"
              >
                <FaSignOutAlt className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop with blur effect - no click handler */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Confirm Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to logout?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleLogoutCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
