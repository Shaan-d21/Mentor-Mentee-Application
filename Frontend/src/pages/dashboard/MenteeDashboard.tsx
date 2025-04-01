import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import axios from 'axios';
import FindMentors from '../mentee/FindMentors';
import MenteeRequests from '../mentee/MenteeRequests';

const MenteeDashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) return;

      try {
        const userInfo = JSON.parse(userInfoString);
        const response = await axios.get(
          `http://localhost:8000/api/v1/user?email=${userInfo.email}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userRole="mentee" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={
                <div className="p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                          Hello {userInfo?.name || 'Mentee'}, Welcome to your Mentee Dashboard
                        </h2>
                        <p className="text-gray-600 mb-4">Here you can track your progress, manage assignments, and communicate with your mentor.</p>
                        
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h3 className="text-lg font-medium text-blue-800 mb-2">Quick Actions</h3>
                          <ul className="space-y-2 text-blue-700">
                            <li>• <a href="/mentee/dashboard/find-mentors" className="hover:underline">Find Mentors</a></li>
                            <li>• <a href="/mentee/dashboard/requests" className="hover:underline">View Sent Requests</a></li>
                            <li>• <a href="/mentee/profile" className="hover:underline">Update Profile</a></li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h3 className="text-lg font-medium text-green-800 mb-2">Your Progress</h3>
                          <ul className="space-y-2 text-green-700">
                            <li>• Course Completion</li>
                            <li>• Recent Achievements</li>
                            <li>• Learning Goals</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-purple-800 mb-2">Upcoming</h3>
                          <ul className="space-y-2 text-purple-700">
                            <li>• Mentor Sessions</li>
                            <li>• Assignment Deadlines</li>
                            <li>• Course Milestones</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="find-mentors" element={<FindMentors />} />
            <Route path="requests" element={<MenteeRequests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard; 