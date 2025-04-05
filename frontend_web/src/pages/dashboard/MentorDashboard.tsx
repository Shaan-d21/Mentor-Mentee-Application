import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import MenteeRequests from '../dashboard/MenteeRequests';
import MyMentees from './MyMentees';
import MentorProfile from './MentorProfile';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaUsers, FaUserCheck, FaUserEdit } from 'react-icons/fa';

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
        
        {/* Display MyMentees component first */}
        <div className="mb-8">
          <MyMentees />
        </div>
        
        {/* Display MenteeRequests component second */}
        <div>
          <MenteeRequests />
        </div>
      </div>
    </div>
  );
};

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem('role')?.toLowerCase();
    if (role !== 'mentor') {
      toast.error('You are not authorized to access this page');
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userRole="mentor" />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="profile" element={<MentorProfile />} />
            <Route path="requests" element={<MenteeRequests />} />
            <Route path="mentees" element={<MyMentees />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 