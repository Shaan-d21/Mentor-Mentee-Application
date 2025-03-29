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
    const checkAuthAndProfile = async () => {
      const userInfoString = localStorage.getItem('userInfo');
      const accessToken = localStorage.getItem('accessToken');

      if (!userInfoString || !accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoString);

        // If profile completion is required, check the status
        if (requireProfileCompletion) {
          const response = await axios.get(
            `http://localhost:8000/api/v1/mentee/profile_status?email=${userInfo.email}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          setIsProfileCompleted(response.data.profile_completed);
        }

        setIsAuthenticated(true);
      } catch (error: any) {
        console.error('Error checking auth status:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
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
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfileCompletion && !isProfileCompleted) {
    return <Navigate to="/profile-completion" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 