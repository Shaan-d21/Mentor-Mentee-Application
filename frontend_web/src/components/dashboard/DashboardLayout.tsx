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
      toast('Please complete your profile first', {
        icon: 'ℹ️',
        duration: 4000,
      });
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
    <div className="flex h-screen bg-gray-100">
      <div className="fixed h-screen w-64">
        <Sidebar userRole={userRole || 'mentee'} />
      </div>
      <div className="flex-1 flex flex-col ml-64">
        <div className="sticky top-0 z-10">
          <DashboardHeader />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 