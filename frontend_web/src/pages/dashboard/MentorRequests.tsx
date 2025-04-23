import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect - no click handler */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            {isRejection ? (
              <>
                Reject Request <span className="text-red-500">*</span>
              </>
            ) : (
              'Approve Request'
            )}
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
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('No access token found');
          return;
        }

        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/mentor/get-requests`,
          {
            headers: {
              'Token': authToken,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('API Response:', response.data);
        
        if (response.data && response.data.object) {
          console.log('Fetched requests successfully:', response.data.object.length);
          setRequests(response.data.object);
        } else {
          console.log('No requests found');
          setRequests([]);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (request: Request, comment: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/mentor-approval/approve-mentee`,
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

      console.log('Request has been approved successfully:', request.id);
      setRequests(requests.filter(r => r.id !== request.id));
      toast.success('Request has been approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve request');
    }
  };

  const handleReject = async (request: Request, comment: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('No access token found');
        return;
      }

      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/mentor-approval/approve-mentee`,
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

      console.log('Request has been rejected successfully:', request.id);
      setRequests(requests.filter(r => r.id !== request.id));
      toast.success('Request has been rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request');
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
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