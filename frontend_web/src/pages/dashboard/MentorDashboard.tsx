import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import Navbar from '../../components/Navbar';
import MenteeRequests from '../mentor/MentorRequests';
import MyMentees from './MyMentees';
import MentorProfile from './MentorProfile';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import RoadmapGenerator from '../../components/RoadmapGenerator';

const DashboardHome: React.FC = () => {
  const [mentorName, setMentorName] = useState<string>('Mentor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const authToken = accessToken.startsWith('Bearer') ? accessToken.split('Bearer ')[1] : accessToken;
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        const response = await axios.get(
          `${apiBaseUrl}/users/mentor/profile`,
          {
            headers: {
              'Token': authToken
            }
          }
        );

        if (response.data && response.data.name) {
          setMentorName(response.data.name);
        }
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {mentorName}!</h1>
      </div>

      <div className="space-y-8">
        <MyMentees />
        <MenteeRequests />
      </div>
    </div>
  );
};

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem('role')?.toLowerCase();
    
    if (role !== 'mentor') {
      toast.error('You are not authorized to access this page');
      navigate('/dashboard');
      return;
    }

    // Handle route redirection if needed
    if (location.pathname === '/mentor/dashboard/mentees') {
      navigate('/mentor/dashboard/my-mentees', { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole="mentor" />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<MentorProfile />} />
            <Route path="/requests" element={<MenteeRequests />} />
            <Route path="/my-mentees" element={<MyMentees />} />
            <Route path="/generate-roadmap" element={<RoadmapGenerator />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 