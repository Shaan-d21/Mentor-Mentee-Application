import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Mentee {
  id: number;
  name: string;
  email: string;
  domain: string;
  course_progress: string;
}

// Mock data for development
const MOCK_MENTEES: Mentee[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    domain: "Database & Backend",
    course_progress: "In Progress"
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    domain: "Artificial Intelligence & Machine Learning",
    course_progress: "In Progress"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "mchen@example.com",
    domain: "Web Development",
    course_progress: "Completed"
  },
  {
    id: 4,
    name: "Jessica Taylor",
    email: "jessica.t@example.com",
    domain: "Cloud Computing",
    course_progress: "Completed"
  }
];

const MyMentees: React.FC = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          toast.error('Authentication token missing. Please log in again.');
          navigate('/auth/login');
          return;
        }
        
        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        try {
          const response = await axios.get(`${apiBaseUrl}/mentor/get-approved-mentee`, {
            headers: { 
              Authorization: authToken 
            }
          });
          
          if (response.data && Array.isArray(response.data)) {
            setMentees(response.data.map((mentee: any) => ({
              id: mentee.id || mentee.mentee_id,
              name: mentee.name || mentee.mentee_name,
              email: mentee.email || mentee.mentee_email,
              domain: mentee.domain || "General",
              course_progress: mentee.course_progress === "Completed" ? "Completed" : "In Progress",
            })));
          } else {
            console.log("Using mock data due to unexpected API response");
            setMentees(MOCK_MENTEES);
          }
        } catch (apiError) {
          console.error("API error, using mock data:", apiError);
          setMentees(MOCK_MENTEES);
        }
      } catch (error: any) {
        console.error('Error fetching mentees:', error);
        setMentees(MOCK_MENTEES);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading mentees...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Mentees</h1>
      </div>

      {mentees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentee Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mentees.map((mentee) => (
                <tr key={mentee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mentee.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mentee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mentee.domain}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mentee.course_progress === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {mentee.course_progress}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No mentees assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default MyMentees; 