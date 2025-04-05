import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGithub, FaEnvelope, FaPhone, FaUserTie } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

interface Mentor {
  mentor_id: number;
  mentor_name: string;
  email: string;
  contact: string;
  github_id: string;
  skills: string[];
  domain: string;
  designation?: string;
  applied_domain?: string; // The domain the mentee applied for
}

// Mock data to use until the API is ready
const MOCK_MENTORS: Mentor[] = [
  {
    mentor_id: 1,
    mentor_name: "John Doe",
    email: "john.doe@example.com",
    contact: "9876543210",
    github_id: "johndoe",
    skills: ["JavaScript", "React", "Node.js"],
    domain: "Web Development",
    designation: "Senior Developer",
    applied_domain: "Frontend Development"
  },
  {
    mentor_id: 2,
    mentor_name: "Jane Smith",
    email: "jane.smith@example.com",
    contact: "8765432109",
    github_id: "janesmith",
    skills: ["Python", "Data Science", "Machine Learning"],
    domain: "Data Science",
    designation: "Data Scientist",
    applied_domain: "Machine Learning"
  },
  {
    mentor_id: 3,
    mentor_name: "Mike Johnson",
    email: "mike.johnson@example.com",
    contact: "7654321098",
    github_id: "mikejohnson",
    skills: ["Java", "Spring Boot", "AWS"],
    domain: "Backend Development",
    designation: "Team Lead",
    applied_domain: "Cloud Computing"
  }
];

const MyMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [useMockData, setUseMockData] = useState(false);
  
  // Determine if this component is shown on the dashboard home
  const isOnDashboardHome = location.pathname === '/mentee/dashboard' || location.pathname === '/mentee/dashboard/';

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
        
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const response = await axios.get(`${apiBaseUrl}/mentee/mentee/approved-mentors`, {
            headers: { Authorization: authToken }
          });
          
          if (response.data.mentors) {
            // Map the response to include the applied_domain field
            const mappedMentors = response.data.mentors.map((mentor: any) => ({
              ...mentor,
              applied_domain: mentor.applied_domain || "Not specified" // Use if available
            }));
            setMentors(mappedMentors);
          }
        } catch (apiError: any) {
          console.error('API Error:', apiError);
          // If API fails, use mock data
          console.log('Using mock data due to API error');
          setUseMockData(true);
          setMentors(MOCK_MENTORS);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error in fetch mentors:', err);
        setUseMockData(true);
        setMentors(MOCK_MENTORS);
        setLoading(false);
      }
    };

    // Always fetch data, regardless of path
    fetchMentors();
  }, []);

  // If we're on the wrong path and not on dashboard home, don't render
  if (!location.pathname.includes('/my-mentors') && !isOnDashboardHome) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto ${!isOnDashboardHome ? 'p-6' : 'p-0'}`}>
      {/* Always show a heading for My Mentors */}
      <h2 className="text-2xl font-bold mb-8">My Mentors</h2>
      
      {mentors.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentor Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain Applied For
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mentors.map((mentor) => (
                <tr key={mentor.mentor_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserTie className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{mentor.mentor_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mentor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mentor.designation || 'Not specified'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mentor.applied_domain || 'Not specified'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">No mentors assigned yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyMentors; 