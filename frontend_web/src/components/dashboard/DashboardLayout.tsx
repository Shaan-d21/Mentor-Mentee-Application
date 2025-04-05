import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../mentor-dashboard/Sidebar';
import toast from 'react-hot-toast';
import LoadingScreen from '../LoadingScreen';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'mentor' | 'mentee'; // If specified, restricts access to this role
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  requiredRole 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role')?.toLowerCase() as 'mentor' | 'mentee';
  const profileStatus = localStorage.getItem('profile_status');
  
  useEffect(() => {
    // Check authentication
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('You need to log in first');
      navigate('/auth/login');
      return;
    }
    
    // Check profile completion
    if (profileStatus !== 'complete') {
      toast.info('Please complete your profile first');
      navigate('/profile-completion');
      return;
    }
    
    // Redirect if role doesn't match required role
    if (requiredRole && userRole !== requiredRole) {
      toast.error(`You don't have permission to access this page`);
      if (userRole === 'mentor') {
        navigate('/mentor/dashboard');
      } else if (userRole === 'mentee') {
        navigate('/mentee/dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }
    
    setLoading(false);
  }, [requiredRole, userRole, navigate, profileStatus]);

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userRole={userRole || 'mentee'} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 