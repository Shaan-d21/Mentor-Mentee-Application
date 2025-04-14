import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardHeaderProps {
  userRole?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const userName = localStorage.getItem('name') || 'User';
  const userEmail = localStorage.getItem('email') || '';
  const role = userRole || localStorage.getItem('role') || 'user';

  const handleLogout = () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    const toastId = toast.loading('Logging out...');
    
    try {
      // Clear all stored user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('profile_status');
      
      // Success
      toast.success('Logged out successfully', { id: toastId });
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', { id: toastId });
      setIsLoggingOut(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const viewProfile = () => {
    // Check for access token first
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('You need to log in first');
      navigate('/auth/login');
      setIsProfileDropdownOpen(false);
      return;
    }
    
    const userRole = localStorage.getItem('role')?.toLowerCase();
    console.log('Viewing profile for role:', userRole);
    
    if (userRole === 'mentor') {
      navigate('/mentor/dashboard/profile');
    } else if (userRole === 'mentee') {
      navigate('/mentee/dashboard/profile');
    } else {
      // Fallback if role not found
      console.error('User role not found in localStorage');
      toast.error('Unable to access profile');
    }
    
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-10 shadow-md">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            <span className="capitalize">{role}</span> Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-white hover:text-gray-200 hover:bg-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 text-gray-800">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 hover:bg-blue-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
            </button>
            
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200 text-gray-800">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <button
                  onClick={viewProfile}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 