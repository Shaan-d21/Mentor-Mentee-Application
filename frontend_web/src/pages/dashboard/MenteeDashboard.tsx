import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import Navbar from '../../components/Navbar';
import FindMentors from '../mentee/FindMentors';
import MenteeRequests from '../mentee/MenteeRequests';
import MenteeProfile from './MenteeProfile';
import MyMentors from '../mentee/MyMentors';
import toast from 'react-hot-toast';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem('name');
    setUserName(name || 'User');
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hello, {userName}! 👋</h1>
        <MyMentors />
        <FindMentors />
        <MenteeRequests />
      </div>
    </div>
  );
};

const MenteeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem('role')?.toLowerCase();
    if (role !== 'mentee') {
      toast.error('You are not authorized to access this page');
      navigate('/dashboard');
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
            <Route path="profile" element={<MenteeProfile />} />
            <Route path="find-mentors" element={<FindMentors />} />
            <Route path="requests" element={<MenteeRequests />} />
            <Route path="my-mentors" element={<MyMentors />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard; 