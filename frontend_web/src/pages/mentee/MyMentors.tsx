import React, { useState, useEffect } from 'react';
import { FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Mentor {
  mentor_id: number;
  mentor_name: string;
  email: string;
  designation: string;
  domain: string;
  experience: string;
}

interface ApiResponse {
  status_code: number;
  message: string;
  object: Array<{
    id: number;
    name: string;
    mail: string;
    designation: string;
    domain_id: number;
    domain_name: string;
    exp?: string;
  }>;
}

const MyMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const isOnDashboardHome = location.pathname === '/mentee/dashboard' || location.pathname === '/mentee/dashboard/';

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          setError('No access token found');
          return;
        }
        
        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        console.log('Fetching mentors from:', `${apiBaseUrl}/mentee/get-approved-mentors`);
        console.log('Using token:', authToken.substring(0, 20) + '...');
        
        const response = await axios.get<ApiResponse>(`${apiBaseUrl}/mentee/get-approved-mentors`, {
          headers: { Token: authToken }
        });
        
        console.log('API Response:', response.data);
        console.log('API Response structure:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.object) {
          if (response.data.object.length > 0) {
            console.log('First mentor object:', response.data.object[0]);
          }
          
          const mappedMentors = response.data.object.map((mentor) => {
            console.log(`Mentor ${mentor.name} experience:`, mentor.exp);
            
            return {
              mentor_id: mentor.id,
              mentor_name: mentor.name,
              email: mentor.mail,
              designation: mentor.designation || 'Not specified',
              experience: mentor.exp || 'Not specified',
              domain: mentor.domain_name || 'Not specified'
            };
          });
          setMentors(mappedMentors);
        } else {
          console.error('Invalid response structure:', response.data);
          setError('Invalid data received from server');
        }
      } catch (err: any) {
        console.error('Error fetching mentors:', err);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
        } else {
          setError(err.response?.data?.message || 'Failed to fetch mentors. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (!location.pathname.includes('/my-mentors') && !isOnDashboardHome) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading mentors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">My Mentors</h2>
      {mentors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaUserTie className="mx-auto h-12 w-12 mb-4" />
          <p>You don't have any mentors yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mentors.map((mentor) => (
                <tr key={mentor.mentor_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{mentor.mentor_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{mentor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{mentor.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{mentor.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{mentor.domain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyMentors; 