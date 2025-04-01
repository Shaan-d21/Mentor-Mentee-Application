import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the mentorship request interface
interface MentorshipRequest {
  id: number;
  mentor_id: number;
  mentor_name: string;
  domain: string;
  approved: boolean;
  request_date: string;
  duration: number;
}

const MenteeRequests: React.FC = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        const response = await axios.get('http://localhost:8000/api/v1/mentee/Requests', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        setRequests(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch mentorship requests');
        setLoading(false);
        console.error('Error fetching mentorship requests:', err);
      }
    };

    fetchRequests();
  }, []);

  // Function to get status display elements
  const getStatusDisplay = (request: MentorshipRequest) => {
    if (request.approved === true) {
      return (
        <span className="flex items-center text-green-600">
          <CheckCircle size={16} className="mr-1" />
          Approved
        </span>
      );
    } else if (request.approved === false && request.duration > 0) {
      return (
        <span className="flex items-center text-red-600">
          <XCircle size={16} className="mr-1" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-yellow-600">
          <Clock size={16} className="mr-1" />
          Pending
        </span>
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Mentorship Requests</h1>
      
      {requests.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.mentor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.domain}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(request.request_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{getStatusDisplay(request)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't sent any mentorship requests yet.</p>
          <a 
            href="/mentee/find-mentors"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Find Mentors
          </a>
        </div>
      )}
    </div>
  );
};

export default MenteeRequests; 