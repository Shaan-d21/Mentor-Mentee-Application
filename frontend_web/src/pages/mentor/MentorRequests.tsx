import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

interface Request {
  id: number;
  name: string;
  mail: string;
  contact: string;
  designation: string;
  exp: number;
  profile_pic_url: string;
  role: string;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
  domain_id: number;
  domain_name: string;
}

const MOCK_REQUESTS: Request[] = [
  {
    id: 1,
    name: "John Doe",
    mail: "john.doe@example.com",
    contact: "1234567890",
    designation: "Software Engineer",
    exp: 2,
    profile_pic_url: "",
    role: "mentee",
    is_profile_complete: true,
    created_at: "2024-03-15T10:30:00Z",
    updated_at: "2024-03-15T10:30:00Z",
    domain_id: 1,
    domain_name: "Web Development"
  }
];

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  isRejection: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, onSubmit, isRejection }) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isRejection && !comment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">
          {isRejection ? 'Reject Request' : 'Approve Request'}
        </h3>
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder={isRejection ? 'Please provide a reason for rejection' : 'Add a comment (optional)'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isRejection ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
            onClick={handleSubmit}
          >
            {isRejection ? 'Reject' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MentorRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isRejection, setIsRejection] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No access token found in localStorage');
          setError('No access token found');
          return;
        }
        
        console.log('Retrieved token from localStorage:', accessToken);
        
        // Remove 'Bearer ' prefix if it exists
        const authToken = accessToken.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;
        console.log('Formatted token for request:', authToken);
        
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        console.log('Making request to:', `${apiBaseUrl}/mentor/get-requests`);
        
        const response = await axios.get(`${apiBaseUrl}/mentor/get-requests`, {
          headers: { 
            'Token': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response from server:', response.data);
        
        if (response.data && response.data.object) {
          setRequests(response.data.object);
        } else {
          setError('No requests data received');
          setRequests(MOCK_REQUESTS);
        }
      } catch (err: any) {
        console.error('Error fetching requests:', err);
        console.error('Error response:', err.response);
        setError('Failed to fetch requests from server');
        setRequests(MOCK_REQUESTS);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (request: Request, comment: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const authToken = accessToken?.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.put(
        `${apiBaseUrl}/mentor-approval/approve-mentee`,
        {
          status: 'approved',
          mentee_id: request.id,
          comment: comment || null
        },
        {
          headers: { 
            'Token': authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove the approved request from the list
      setRequests(requests.filter(r => r.id !== request.id));
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Failed to approve request');
    }
  };

  const handleReject = async (request: Request, comment: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const authToken = accessToken?.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Log the request data for debugging
      console.log('Rejecting request with data:', {
        status: 'not approved',
        mentee_id: request.id,
        comment: comment
      });
      
      await axios.put(
        `${apiBaseUrl}/mentor-approval/approve-mentee`,
        {
          status: 'not approved',
          mentee_id: request.id,
          comment: comment
        },
        {
          headers: { 
            'Token': authToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Remove the rejected request from the list
      setRequests(requests.filter(r => r.id !== request.id));
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Failed to reject request');
    }
  };

  const openModal = (request: Request, isReject: boolean) => {
    setSelectedRequest(request);
    setIsRejection(isReject);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8">Mentee Requests</h2>
      
      {requests.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.mail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.designation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.domain_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(request, false)}
                        className="p-2 text-green-500 hover:text-green-600"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal(request, true)}
                        className="p-2 text-red-500 hover:text-red-600"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">No requests found.</p>
        </div>
      )}

      <ApprovalModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={(comment) => {
          if (selectedRequest) {
            if (isRejection) {
              handleReject(selectedRequest, comment);
            } else {
              handleApprove(selectedRequest, comment);
            }
          }
          closeModal();
        }}
        isRejection={isRejection}
      />
    </div>
  );
};

export default MentorRequests; 