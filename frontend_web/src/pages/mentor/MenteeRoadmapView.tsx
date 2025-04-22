import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Topic {
  topic_id: number;
  name: string;
  description: string;
  subtopics: string[];
  importance: string;
  topic_status: string;
}

interface RoadmapResponse {
  status_code: number;
  message: string;
  roadmap_id: number;
  roadmap_explanation: string;
  topic: Topic[];
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  isReassign: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, onSubmit, isReassign }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }
    onSubmit(feedback);
    setFeedback('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">
          {isReassign ? 'Reassign Topic' : 'Approve Topic'}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your comments..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded cursor-pointer ${
              isReassign ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
            onClick={handleSubmit}
          >
            {isReassign ? 'Reassign' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MenteeRoadmapView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isReassign, setIsReassign] = useState(false);
  const { roadmap_id, mentee_name, mentee_id } = location.state || {};

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Roadmap ID:', roadmap_id);
    console.log('Mentee name:', mentee_name);
    console.log('Mentee ID:', mentee_id);

    if (!roadmap_id || !mentee_id) {
      toast.error('Missing required information');
      navigate('/mentor/dashboard/my-mentees');
      return;
    }

    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          toast.error('Please login to view roadmap');
          navigate('/auth/login');
          return;
        }

        console.log('Fetching roadmap for ID:', roadmap_id);
        console.log('API URL:', `${import.meta.env.VITE_API_URL}/mentee/roadmap-topics/${roadmap_id}`);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/mentee/roadmap-topics/${roadmap_id}`,
          {
            headers: {
              'Token': accessToken,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );

        console.log('Roadmap response:', response.data);

        if (response.data && response.data.status_code === 200) {
          setRoadmap(response.data);
        } else {
          toast.error(response.data?.message || 'No roadmap data found');
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            toast.error('No roadmap found for this mentee');
          } else {
            toast.error(error.response?.data?.message || 'Failed to fetch roadmap details');
          }
        } else {
          toast.error('Failed to fetch roadmap details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [roadmap_id, mentee_id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading roadmap...</span>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No roadmap data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'marked':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'marked':
        return 'Marked';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      case 'assigned':
        return 'Assigned';
      case 'complete':
        return 'Completed';
      case 'completed':
        return 'Completed';
      default:
        return status.replace('_', ' ');
    }
  };

  const handleApprove = async (topic: Topic, feedback: string) => {
    try {
      if (!mentee_id) {
        toast.error('Mentee information is missing');
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please login to approve topic');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/progress/mark_complete`,
        {
          topic_id: parseInt(topic.topic_id.toString()),
          feedback: feedback,
          mentee_id: parseInt(mentee_id.toString())
        },
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status_code === 200) {
        // Update the topic status in the local state
        setRoadmap(prev => {
          if (!prev) return null;
          return {
            ...prev,
            topic: prev.topic.map(t => 
              t.topic_id === topic.topic_id 
                ? { ...t, topic_status: 'complete' }
                : t
            )
          };
        });

        toast.success('Topic has been approved successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to approve topic');
      }
    } catch (error) {
      console.error('Error approving topic:', error);
      toast.error('Failed to approve topic. Please try again.');
    }
  };

  const handleReassign = async (topic: Topic, feedback: string) => {
    try {
      if (!mentee_id) {
        toast.error('Mentee information is missing');
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please login to reassign topic');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/progress/reassign_topic`,
        {
          topic_id: parseInt(topic.topic_id.toString()),
          feedback: feedback,
          mentee_id: parseInt(mentee_id.toString())
        },
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status_code === 200) {
        // Update the topic status in the local state
        setRoadmap(prev => {
          if (!prev) return null;
          return {
            ...prev,
            topic: prev.topic.map(t => 
              t.topic_id === topic.topic_id 
                ? { ...t, topic_status: 'assigned' }
                : t
            )
          };
        });

        toast.success('Topic has been reassigned successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to reassign topic');
      }
    } catch (error) {
      console.error('Error reassigning topic:', error);
      toast.error('Failed to reassign topic. Please try again.');
    }
  };

  const openModal = (topic: Topic, isReassignAction: boolean) => {
    setSelectedTopic(topic);
    setIsReassign(isReassignAction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTopic(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {mentee_name}'s Learning Roadmap
        </h1>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Roadmap Overview</h2>
          <p className="text-gray-700 leading-relaxed">{roadmap.roadmap_explanation}</p>
        </div>
      </div>

      {/* Progress Overview Section */}
      {roadmap.topic && roadmap.topic.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round((roadmap.topic.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / roadmap.topic.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(roadmap.topic.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / roadmap.topic.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{roadmap.topic.length}</div>
              <div className="text-sm text-purple-600">Total Topics</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {roadmap.topic.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">
                {roadmap.topic.filter(t => t.topic_status === 'marked').length}
              </div>
              <div className="text-sm text-yellow-600">Marked</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {roadmap.topic.filter(t => t.topic_status === 'in_progress' || t.topic_status === 'assigned').length}
              </div>
              <div className="text-sm text-blue-600">In Progress</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {roadmap.topic && roadmap.topic.length > 0 ? (
          roadmap.topic.map((topic) => (
            <div 
              key={topic.topic_id} 
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{topic.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(topic.topic_status)} group-hover:shadow-sm transition-all duration-300`}>
                      {getStatusText(topic.topic_status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{topic.description}</p>
                  <div className="bg-indigo-50 rounded-lg p-4 inline-block group-hover:bg-indigo-100 transition-colors duration-300">
                    <p className="text-sm text-indigo-700 group-hover:text-indigo-800 transition-colors duration-300">
                      <span className="font-medium">Importance:</span> {topic.importance}
                    </p>
                  </div>
                </div>
                {topic.topic_status === 'marked' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal(topic, false)}
                      className="p-3 text-green-500 hover:text-green-600 transition-colors duration-200 hover:scale-110 cursor-pointer"
                      title="Approve"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => openModal(topic, true)}
                      className="p-3 text-yellow-500 hover:text-yellow-600 transition-colors duration-200 hover:scale-110 cursor-pointer"
                      title="Reassign"
                    >
                      <RefreshCw className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>

              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4 group-hover:text-blue-700 transition-colors duration-300">Subtopics</h3>
                  <div className="flex flex-wrap gap-3">
                    {topic.subtopics.map((subtopic, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                      >
                        {subtopic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600">No topics available in this roadmap</p>
          </div>
        )}
      </div>

      <ApprovalModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={(feedback) => {
          if (selectedTopic) {
            if (isReassign) {
              handleReassign(selectedTopic, feedback);
            } else {
              handleApprove(selectedTopic, feedback);
            }
          }
          closeModal();
        }}
        isReassign={isReassign}
      />
    </div>
  );
};

export default MenteeRoadmapView; 