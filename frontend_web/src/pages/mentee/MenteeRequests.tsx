import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
      <h2 className="text-2xl font-bold mb-8">My Requests</h2>
      
      {requests.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor Name
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
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.mentor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.mentor_mail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.mentor_designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.domain_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <div className="text-sm text-gray-900">
                        {request.comment ? (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <div className="flex items-start">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 line-clamp-2" ref={(el) => {
                                  if (el && el.scrollHeight > el.clientHeight) {
                                    el.nextElementSibling?.classList.remove('hidden');
                                  }
                                }}>
                                  {request.comment}
                                </p>
                                <button
                                  onClick={() => {
                                    setSelectedComment(request.comment);
                                    setShowCommentModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-medium mt-1 hidden"
                                >
                                  See more
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedMentor(request);
                            setShowCancelModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-red-400 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Cancel Request
                        </button>
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
          <p className="text-gray-500 text-lg mb-4">No requests found.</p>
        </div>
      )}

      {/* Cancel Request Confirmation Modal */}
      {showCancelModal && selectedMentor && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Request</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your mentorship request to {selectedMentor.mentor_name}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedMentor(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                No, Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Full Comment</h3>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedComment(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedComment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeRequests; 