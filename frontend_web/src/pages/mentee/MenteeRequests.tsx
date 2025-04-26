import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface Request {
  mentor_name: string;
  mentor_mail: string;
  mentor_designation: string;
  domain_name: string;
  status: string;
  comment: string | null;
  mentor_id: string;
}

const MenteeRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Request | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mentee/Requests`, {
          headers: { 
            Token: authToken,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to fetch requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCancelRequest = async () => {
    if (!selectedMentor) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;

      const response = await axios({
        method: 'delete',
        url: `${import.meta.env.VITE_API_URL}/mentee/cancel_request`,
        headers: {
          Token: authToken,
          'Content-Type': 'application/json'
        },
        data: {
          mentor_id: selectedMentor.mentor_id
        }
      });

      if (response.status === 200) {
        setRequests(requests.filter(req => req.mentor_id !== selectedMentor.mentor_id));
        toast.success('Request cancelled successfully');
        setShowCancelModal(false);
        setSelectedMentor(null);
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request. Please try again.');
    }
  };

  const openDetailsModal = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 text-sm">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-red-500 text-base">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">My Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg className="mx-auto h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm md:text-base">No requests found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openDetailsModal(request)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <div className="font-medium text-gray-900">{request.mentor_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <div className="text-gray-900">{request.mentor_designation}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                      <div className="text-gray-900">{request.domain_name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 whitespace-nowrap text-center"
                      onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking Cancel
                    >
                      {request.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedMentor(request);
                            setShowCancelModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-red-400 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {requests.map((request, index) => (
              <div key={index} className="py-3 px-2 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => openDetailsModal(request)}
                  >
                    <p className="text-sm font-medium text-gray-900">{request.mentor_name}</p>
                    <p className="text-xs text-gray-500">{request.mentor_designation}</p>
                    <p className="text-xs text-gray-500">{request.domain_name}</p>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedMentor(request);
                        setShowCancelModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-red-400 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cancel Request Confirmation Modal */}
      {showCancelModal && selectedMentor && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Cancel Request</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to cancel your mentorship request to {selectedMentor.mentor_name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedMentor(null);
                }}
                className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                No, Keep
              </button>
              <button
                onClick={handleCancelRequest}
                className="px-3 py-1.5 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-medium text-gray-900">Full Comment</h3>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedComment(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 overflow-y-auto text-sm">
              <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedComment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-semibold text-gray-900">Request Details</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Mentor Name:</span>
                <p className="text-gray-900">{selectedRequest.mentor_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{selectedRequest.mentor_mail}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Designation:</span>
                <p className="text-gray-900">{selectedRequest.mentor_designation}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Domain:</span>
                <p className="text-gray-900">{selectedRequest.domain_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Comment:</span>
                {selectedRequest.comment ? (
                  <p 
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      setSelectedComment(selectedRequest.comment);
                      setShowCommentModal(true);
                      setShowDetailsModal(false);
                    }}
                  >
                    {selectedRequest.comment}
                  </p>
                ) : (
                  <p className="text-gray-400">No comment</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeRequests;