import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileCompletion?: boolean;
}

const ProtectedRoute = ({ children, requireProfileCompletion = false }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndProfile = async () => {
      const userInfoString = localStorage.getItem('userInfo');
      const accessToken = localStorage.getItem('accessToken');

      if (!userInfoString || !accessToken) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoString);

        // If profile completion is required, check the status
        if (requireProfileCompletion) {
          // Use the appropriate endpoint based on user role
          const endpoint = userInfo.role === 'mentor' 
            ? `http://localhost:8000/api/v1/mentor/profile_status?email=${userInfo.email}`
            : `http://localhost:8000/api/v1/mentee/profile_status?email=${userInfo.email}`;
            
          const response = await axios.get(
            endpoint,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (isMounted) {
            setIsProfileCompleted(response.data.profile_completed);
          }
        }

        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error('Error checking auth status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
          toast.error('Session expired. Please log in again.');
        }
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuthAndProfile();

    return () => {
      isMounted = false;
    };
  }, [requireProfileCompletion]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireProfileCompletion && !isProfileCompleted) {
    return <Navigate to="/profile-completion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 