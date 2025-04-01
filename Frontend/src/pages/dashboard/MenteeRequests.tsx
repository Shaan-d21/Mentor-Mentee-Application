import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '~/config/api';

interface MenteeRequest {
  mentee_id: number;
  mentee_name: string;
  domain: string;
  approved: boolean;
}

const MenteeRequests: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<MenteeRequest[]>([]);
  const [processing, setProcessing] = useState<number | null>(null);

  // Fetch mentee requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/mentor/get-requests');
      if (response.status === 200) {
        setRequests(response.data.object);
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/auth/login');
      } else {
        toast.error('Failed to load mentee requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [navigate]);

  // Handle request approval/rejection
  const handleRequest = async (menteeId: number, approved: boolean) => {
    try {
      setProcessing(menteeId);
      const response = await api.put('/api/v1/mentor-approval/approve-mentee', {
        mentee_id: menteeId,
        approved: approved
      });

      if (response.status === 200) {
        toast.success(approved ? 'Mentee request approved!' : 'Mentee request rejected');
        // Refresh requests list
        fetchRequests();
      }
    } catch (error: any) {
      console.error('Error handling request:', error);
      toast.error('Failed to process request');
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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mentee Requests</h1>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <div key={request.mentee_id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{request.mentee_name}</h3>
                  <p className="text-gray-600">Domain: {request.domain}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRequest(request.mentee_id, true)}
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
                    onClick={() => handleRequest(request.mentee_id, false)}
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No pending mentee requests</p>
        </div>
      )}
    </div>
  );
};

export default MenteeRequests; 