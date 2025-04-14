import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireProfileCompletion?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, requireProfileCompletion = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const profileStatus = localStorage.getItem('profile_status');
      const role = localStorage.getItem('role');

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsAuthenticated(true);
        setUserRole(role);

        // If profile completion is required, check profile status
        if (requireProfileCompletion) {
          // Check if profile is complete
          if (profileStatus === 'complete') {
            console.log("Profile is marked as complete in localStorage");
            setIsProfileCompleted(true);
          } else {
            // Try to get profile status from backend
            try {
              const response = await api.get('/users/all_users');
              
              if (response.status === 200) {
                // Find the user with matching email
                const email = localStorage.getItem('email');
                console.log("Checking profile completion for email:", email);
                
                // If we can't find the email in localStorage, we can't verify the user
                if (!email) {
                  console.log("No email found in localStorage, redirecting to login");
                  localStorage.removeItem('accessToken');
                  setIsAuthenticated(false);
                  setIsLoading(false);
                  return;
                }
                
                const user = response.data.find((u: any) => u.mail === email);
                
                if (user && user.is_profile_complete) {
                  console.log("User found in all_users and profile is complete");
                  setIsProfileCompleted(true);
                  localStorage.setItem('profile_status', 'complete');
                } else if (user) {
                  console.log("User found but profile is not complete");
                  setIsProfileCompleted(false);
                  localStorage.setItem('profile_status', 'incomplete');
                } else {
                  console.log("User not found in all_users API, treating as new user with incomplete profile");
                  setIsProfileCompleted(false);
                  localStorage.setItem('profile_status', 'incomplete');
                }
              }
            } catch (profileError) {
              console.error('Error checking profile status:', profileError);
              // Fallback to localStorage if API fails
              console.log('Falling back to localStorage profile status:', profileStatus);
              setIsProfileCompleted(profileStatus === 'complete');
            }
          }
        } else {
          // If profile completion not required, set to true
          setIsProfileCompleted(true);
        }
      } catch (error: any) {
        console.error('Error checking auth status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('role');
          localStorage.removeItem('profile_status');
          toast.error('Session expired. Please log in again.');
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndProfile();
  }, [requireProfileCompletion]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireProfileCompletion && !isProfileCompleted) {
    return <Navigate to="/profile-completion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 