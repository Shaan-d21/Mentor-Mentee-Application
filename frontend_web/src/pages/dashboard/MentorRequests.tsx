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
      toast.error('Please provide a reason for rejection');
      return;
    }
    onSubmit(comment);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {isRejection ? (
            <>
              Reject Request <span className="text-red-500">*</span>
            </>
          ) : (
            'Approve Request'
          )}
        </h3>
        <textarea
          className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isRejection ? 'Please provide a reason for rejection' : 'Add a comment (optional)'}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="py-2 px-4 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`py-2 px-4 rounded-md text-white ${
              isRejection ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
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
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
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

        if (response.data && response.data.object) {
          setRequests(response.data.object);
        } else {
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

      setRequests(requests.filter(r => r.id !== request.id));
      toast.success('Request has been approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve request');
      toast.error('Failed to approve request');
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

      setRequests(requests.filter(r => r.id !== request.id));
      toast.success('Request has been rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request');
      toast.error('Failed to reject request');
    }
  };

  const openApprovalModal = (request: Request, isReject: boolean) => {
    setSelectedRequest(request);
    setIsRejection(isReject);
    setModalOpen(true);
    setDetailsModalOpen(false);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedRequest(null);
  };

  const closeApprovalModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleRowClick = (request: Request) => {
    if (window.innerWidth < 640) {
      // Mobile: Show details modal
      setSelectedRequest(request);
      setDetailsModalOpen(true);
    }
    // Desktop: No action on row click, handled by action buttons
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
    <div className="mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-md max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mentee Requests</h1>
      </div>

      {requests.length > 0 ? (
        <>
          {/* Mobile View: List format */}
          <div className="sm:hidden space-y-2">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(request)}
              >
                <div className="text-sm font-medium text-blue-600 hover:underline">
                  {request.name}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table format */}
          <div className="hidden sm:block overflow-x-auto">
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
                      <div className="text-sm text-gray-500">{request.mail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{request.domain_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openApprovalModal(request, false)}
                          className="p-2 text-blue-600 hover:text-blue-700"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openApprovalModal(request, true)}
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

          {/* Mobile Details Modal */}
          {selectedRequest && detailsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
              <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
                <button
                  onClick={closeDetailsModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedRequest.name}</h2>
                <div className="space-y-2">
                  <p><span className="font-medium text-gray-700">Email:</span> {selectedRequest.mail}</p>
                  <p><span className="font-medium text-gray-700">Designation:</span> {selectedRequest.designation}</p>
                  <p><span className="font-medium text-gray-700">Domain:</span> {selectedRequest.domain_name}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => openApprovalModal(selectedRequest, false)}
                    className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openApprovalModal(selectedRequest, true)}
                    className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Approval/Rejection Modal */}
          <ApprovalModal
            isOpen={modalOpen}
            onClose={closeApprovalModal}
            onSubmit={(comment) => {
              if (selectedRequest) {
                if (isRejection) {
                  handleReject(selectedRequest, comment);
                } else {
                  handleApprove(selectedRequest, comment);
                }
              }
              closeApprovalModal();
            }}
            isRejection={isRejection}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default MentorRequests;