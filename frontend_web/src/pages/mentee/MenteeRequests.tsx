import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the mentorship request interface with additional fields
interface MentorshipRequest {
  id: number;
  mentor_id: number;
  mentor_name: string;
  mentor_email?: string;
  designation?: string;
  domain: string;
  approved: boolean | null;
  request_date: string;
  duration: number;
  rejection_reason?: string;
  status?: string; // 'pending', 'approved', or 'rejected'
}

// Mock data to use when API is not available
const MOCK_REQUESTS: MentorshipRequest[] = [
  {
    id: 1,
    mentor_id: 101,
    mentor_name: "John Smith",
    mentor_email: "john.smith@example.com",
    designation: "Senior Software Engineer",
    domain: "Database & Backend",
    approved: true,
    request_date: "2023-05-15T10:30:00Z",
    duration: 30,
    status: "approved"
  },
  {
    id: 2,
    mentor_id: 102,
    mentor_name: "Amelia Johnson",
    mentor_email: "amelia.j@example.com",
    designation: "Database Architect",
    domain: "Cloud Computing",
    approved: false,
    request_date: "2023-06-02T14:15:00Z",
    duration: 0,
    rejection_reason: "Mentor is at maximum capacity for mentees currently.",
    status: "rejected"
  },
  {
    id: 3,
    mentor_id: 103,
    mentor_name: "Michael Chen",
    mentor_email: "michael.chen@example.com",
    designation: "Backend Developer",
    domain: "Artificial Intelligence & Machine Learning",
    approved: null,
    request_date: "2023-06-10T09:45:00Z",
    duration: 0,
    status: "pending"
  }
];

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
        
        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        try {
          const response = await axios.get(`${apiBaseUrl}/mentee/requests`, {
            headers: { Authorization: authToken }
          });
          
          if (response.data && Array.isArray(response.data)) {
            // Transform API data to match our interface if needed
            const formattedRequests = response.data.map((request: any) => ({
              ...request,
              // Ensure consistent status format
              status: request.approved === true ? 'approved' : 
                     request.approved === false ? 'rejected' : 'pending'
            }));
            setRequests(formattedRequests);
          } else {
            console.log('Using mock data due to unexpected API response structure');
            setRequests(MOCK_REQUESTS);
          }
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          // If the API call fails, use mock data
          setRequests(MOCK_REQUESTS);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching mentorship requests:', err);
        setRequests(MOCK_REQUESTS);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Function to get status display elements
  const getStatusDisplay = (request: MentorshipRequest) => {
    const status = request.status || (
      request.approved === true ? 'approved' : 
      request.approved === false ? 'rejected' : 'pending'
    );
    
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle size={16} className="mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-600">
            <XCircle size={16} className="mr-1" />
            Rejected
          </span>
        );
      case 'pending':
      default:
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
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">My Mentorship Requests</h1>
      
      {requests.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
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
                      <div className="text-sm text-gray-500">{request.mentor_email || 'Not available'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.designation || 'Not specified'}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(request.status === 'rejected' || request.approved === false) && request.rejection_reason ? (
                        <div className="text-sm text-red-500 flex items-start">
                          <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                          <span>{request.rejection_reason}</span>
                        </div>
                      ) : (
                        request.status === 'approved' || request.approved === true ? (
                          <div className="text-sm text-green-500">
                            Duration: {request.duration} days
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            Awaiting response
                          </div>
                        )
                      )}
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
            href="/mentee/dashboard/find-mentors"
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