import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, XCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface MenteeRequest {
  mentee_id: number;
  mentee_name: string;
  mentee_email: string;
  domain: string;
  request_date: string;
  approved?: boolean | null;
}

// Mock data for development
const MOCK_REQUESTS: MenteeRequest[] = [
  {
    mentee_id: 1,
    mentee_name: "Alex Johnson",
    mentee_email: "alex.johnson@example.com",
    domain: "Database & Backend",
    request_date: "2023-07-15T10:30:00Z"
  },
  {
    mentee_id: 2,
    mentee_name: "Sarah Williams",
    mentee_email: "sarah.w@example.com",
    domain: "Artificial Intelligence & Machine Learning",
    request_date: "2023-07-16T14:45:00Z"
  },
  {
    mentee_id: 3,
    mentee_name: "Michael Chen",
    mentee_email: "mchen@example.com",
    domain: "Web Development",
    request_date: "2023-07-17T09:15:00Z"
  }
];

const MenteeRequests: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MenteeRequest[]>([]);
  const [processing, setProcessing] = useState<number | null>(null);
  
  // New states for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedMenteeId, setSelectedMenteeId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

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

  // Fetch mentee requests
  const fetchRequests = async () => {
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
        const response = await axios.get(
          `${apiBaseUrl}/mentee/mentee/requests`,
          {
            headers: {
              Token: authToken
            }
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          setRequests(response.data);
        } else {
          console.log("Using mock data due to unexpected API response");
          setRequests(MOCK_REQUESTS);
        }
      } catch (apiError) {
        console.error("API error, using mock data:", apiError);
        setRequests(MOCK_REQUESTS);
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      setRequests(MOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [navigate]);

  // Handle request approval
  const handleApprove = async (menteeId: number) => {
    try {
      setProcessing(menteeId);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/auth/login');
        return;
      }
      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      await axios.put(
        `${apiBaseUrl}/mentee/mentee/requests/${menteeId}/approve`,
        {},
        {
          headers: {
            Token: authToken
          }
        }
      );
      
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  // Show rejection modal
  const openRejectionModal = (menteeId: number) => {
    setSelectedMenteeId(menteeId);
    setRejectionReason('');
    setRejectionError('');
    setShowRejectionModal(true);
  };

  // Handle request rejection
  const handleReject = async () => {
    if (!selectedMenteeId || !rejectionReason.trim()) {
      setRejectionError('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(selectedMenteeId);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Authentication token missing. Please log in again.');
        navigate('/auth/login');
        return;
      }
      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      await axios.put(
        `${apiBaseUrl}/mentee/mentee/requests/${selectedMenteeId}/reject`,
        { reason: rejectionReason },
        {
          headers: {
            Token: authToken
          }
        }
      );
      
      toast.success('Request rejected successfully');
      setShowRejectionModal(false);
      setRejectionReason('');
      setRejectionError('');
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mentee Requests</h1>
      </div>

      {requests.length > 0 ? (
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
                  Request Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.mentee_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.mentee_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.mentee_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.domain}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(request.request_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.mentee_id)}
                        disabled={processing === request.mentee_id}
                        className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center disabled:opacity-50 ${
                          processing === request.mentee_id ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        {processing === request.mentee_id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Check size={16} className="mr-1" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectionModal(request.mentee_id)}
                        disabled={processing === request.mentee_id}
                        className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center disabled:opacity-50 ${
                          processing === request.mentee_id ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        {processing === request.mentee_id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle size={16} className="mr-1" />
                        )}
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No pending mentee requests</p>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Provide Rejection Reason</h3>
              
              {rejectionError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-start">
                  <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
                  <p className="text-red-500">{rejectionError}</p>
                </div>
              )}
              
              <p className="mb-4 text-gray-600">
                Please provide a detailed reason for rejecting this mentorship request.
                This feedback will be shared with the mentee.
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rejection-reason">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Ex: I currently have a full mentee load and cannot take on additional mentees at this time."
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (e.target.value.trim()) setRejectionError('');
                  }}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeRequests; 