import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Mentee {
  id: number;
  name: string;
  email: string;
  designation: string;
  domain: string;
}

// Mock data for development
const MOCK_MENTEES: Mentee[] = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    designation: "Software Engineer",
    domain: "Database & Backend"
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    designation: "Data Scientist",
    domain: "Artificial Intelligence & Machine Learning"
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
        const role = localStorage.getItem('role');
        
        if (!accessToken) {
          toast.error('Authentication token missing. Please log in again.');
          navigate('/auth/login');
          return;
        }

        const authToken = accessToken.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        try {
          const response = await axios.get(
            `${apiBaseUrl}/mentor/get-approved-mentee`,
            {
              headers: {
                'Token': authToken
              }
            }
          );

          if (response.data && response.data.object) {
            const menteesData = response.data.object;
            const mappedMentees = menteesData.map((mentee: any) => ({
              id: mentee.id,
              name: mentee.name,
              email: mentee.mail,
              designation: mentee.designation || "Not specified",
              domain: mentee.domain_name || "Not specified"
            }));
            setMentees(mappedMentees);
          } else {
            setMentees(MOCK_MENTEES);
          }
        } catch (apiError: any) {
          toast.error('Failed to fetch mentees. Using mock data.');
          setMentees(MOCK_MENTEES);
        }
      } catch (error: any) {
        toast.error('An error occurred while fetching mentees.');
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
                  Designation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
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
                    <div className="text-sm text-gray-500">{mentee.designation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mentee.domain}</div>
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