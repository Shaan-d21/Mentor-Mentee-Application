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
  roadmap_id?: number;
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
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          toast.error('Authentication token missing. Please log in again.');
          navigate('/auth/login');
          return;
        }

        const authToken = accessToken.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;

        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/mentor/get-approved-mentee`, {
            headers: {
              'Token': authToken
            }
          });

          if (response.data && response.data.object) {
            const menteesData = response.data.object;
            const mappedMentees = menteesData.map((mentee: any) => ({
              id: mentee.id,
              name: mentee.name,
              email: mentee.mail,
              designation: mentee.designation || "Not specified",
              domain: mentee.domain_name || "Not specified",
              roadmap_id: mentee.roadmap_id
            }));
            setMentees(mappedMentees);
          } else {
            setMentees(MOCK_MENTEES);
          }
        } catch (apiError: any) {
          toast.error('Failed to fetch mentees. Using mock data.');
          setMentees(MOCK_MENTEES);
        }
      } catch (error) {
        toast.error('An error occurred while fetching mentees.');
        setMentees(MOCK_MENTEES);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [navigate]);

  const handleRowClick = (mentee: Mentee) => {
    if (window.innerWidth < 640) {
      // Mobile: Show details modal
      setSelectedMentee(mentee);
    } else {
      // Desktop: Show roadmap modal or toast
      if (mentee.roadmap_id) {
        setSelectedMentee(mentee);
        setShowRoadmapModal(true);
      } else {
        toast.error('No roadmap assigned to this mentee');
      }
    }
  };

  const closeDetailsModal = () => {
    setSelectedMentee(null);
  };

  const closeRoadmapModal = () => {
    setShowRoadmapModal(false);
    setSelectedMentee(null);
  };

  const handleViewRoadmap = (mentee: Mentee) => {
    if (mentee.roadmap_id) {
      navigate('/mentor/dashboard/mentee-roadmap', {
        state: {
          roadmap_id: mentee.roadmap_id,
          mentee_name: mentee.name,
          mentee_id: mentee.id
        }
      });
      closeRoadmapModal();
      closeDetailsModal();
    } else {
      toast.error('No roadmap available for this mentee');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading mentees...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-md max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Mentees</h1>
      </div>

      {mentees.length > 0 ? (
        <>
          {/* Mobile View: List format */}
          <div className="sm:hidden space-y-2">
            {mentees.map((mentee) => (
              <div
                key={mentee.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(mentee)}
              >
                <div className="text-sm font-medium text-blue-600 hover:underline">
                  {mentee.name}
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mentees.map((mentee) => (
                  <tr
                    key={mentee.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(mentee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font

-medium text-gray-900">
                        {mentee.name}
                      </div>
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

          {/* Mobile Details Modal */}
          {selectedMentee && !showRoadmapModal && (
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
                <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedMentee.name}</h2>
                <div className="space-y-2">
                  <p><span className="font-medium text-gray-700">Email:</span> {selectedMentee.email}</p>
                  <p><span className="font-medium text-gray-700">Designation:</span> {selectedMentee.designation}</p>
                  <p><span className="font-medium text-gray-700">Domain:</span> {selectedMentee.domain}</p>
                </div>
                <button
                  onClick={() => handleViewRoadmap(selectedMentee)}
                  className={`mt-4 w-full py-2 px-4 rounded-md text-white ${
                    selectedMentee.roadmap_id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedMentee.roadmap_id}
                >
                  View Roadmap
                </button>
              </div>
            </div>
          )}

          {/* Desktop Roadmap Modal */}
          {selectedMentee && showRoadmapModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
              <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
                <button
                  onClick={closeRoadmapModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedMentee.name}'s Roadmap</h2>
                <p className="text-gray-600 mb-4">Would you like to view the roadmap for {selectedMentee.name}?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeRoadmapModal}
                    className="py-2 px-4 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleViewRoadmap(selectedMentee)}
                    className="py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Roadmap
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No mentees assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default MyMentees;