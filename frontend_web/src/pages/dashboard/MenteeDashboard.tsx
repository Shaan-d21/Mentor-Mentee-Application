import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import Navbar from '../../components/Navbar';
import FindMentors from '../mentee/FindMentors';
import MenteeRequests from '../mentee/MenteeRequests';
import MenteeProfile from './MenteeProfile';
import MyMentors from '../mentee/MyMentors';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import MenteeRoadmap from '../mentee/MenteeRoadmap';
import ViewFeedback from '../mentee/ViewFeedback';

const DashboardHome: React.FC = () => {
  const [userName, setMentorName] = useState<string>('Mentee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user name from localStorage and extract first name
    const fullName = localStorage.getItem('name') || 'Mentee';
    const firstName = fullName.split(' ')[0];
    setMentorName(firstName);
    setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userName}!</h1>
      </div>

      <div className="space-y-8">
        <FindMentors />
      </div>
    </div>
  );
};

const MenteeDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role')?.toLowerCase();
    
    if (role !== 'mentee') {
      toast.error('You are not authorized to access this page');
      navigate('/dashboard');
      return;
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole="mentee" />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<MenteeProfile />} />
            <Route path="/find-mentors" element={<FindMentors />} />
            <Route path="/view-feedback" element={<ViewFeedback />} />
            <Route path="/requests" element={<MenteeRequests />} />
            <Route path="/my-mentors" element={<MyMentors />} />
            <Route path="/roadmaps" element={<MenteeRoadmap />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard; 