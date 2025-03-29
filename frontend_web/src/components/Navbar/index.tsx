import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="mr-auto">
            <Link to="/" className="text-2xl font-bold text-white">
              Mentor-Mentee
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link
              to="/"
              className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Logout
                </button>
              </>
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
          <div className="sm:hidden">
            <button
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none"
              onClick={toggleMenu}
            >
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
            <Link
              to="/"
              className="block text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded transition duration-300"
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
