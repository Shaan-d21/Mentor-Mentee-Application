import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../../components/mentor-dashboard/Sidebar';
import axios from 'axios';

const MentorDashboard: React.FC = () => {
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
      <Sidebar userRole="mentor" />
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
                          Hello {userInfo?.name || 'Mentor'}, Welcome to your Mentor Dashboard
                        </h2>
                        <p className="text-gray-600 mb-4">Here you can manage your courses, students, and mentoring activities.</p>
                        
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                          <h3 className="text-lg font-medium text-green-800 mb-2">Quick Actions</h3>
                          <ul className="space-y-2 text-green-700">
                            <li>• View Student Requests</li>
                            <li>• Manage Courses</li>
                            <li>• Schedule Sessions</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h3 className="text-lg font-medium text-blue-800 mb-2">Recent Activity</h3>
                          <ul className="space-y-2 text-blue-700">
                            <li>• New Student Requests</li>
                            <li>• Upcoming Sessions</li>
                            <li>• Course Updates</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-purple-800 mb-2">Statistics</h3>
                          <ul className="space-y-2 text-purple-700">
                            <li>• Active Students</li>
                            <li>• Course Progress</li>
                            <li>• Session History</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 