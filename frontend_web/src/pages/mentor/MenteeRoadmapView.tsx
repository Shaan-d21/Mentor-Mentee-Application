import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, CheckCircle, RefreshCw, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Topic {
  topic_id: number;
  name: string;
  description: string;
  subtopics: string[] | null;
  topic_duration_days: number | null;
  importance: string;
  topic_status: string;
}

interface RoadmapResponse {
  status_code: number;
  message: string;
  roadmap_id: number;
  roadmap_explanation: string;
  topics: Topic[];
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[90vw] sm:max-w-lg sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            {isReassign ? 'Reassign Topic' : 'Approve Topic'}
          </h3>
          <div className="mb-4">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Comments <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your comments..."
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4 gap-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base font-medium text-gray-700 transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm sm:text-base font-medium text-white ${
                isReassign ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
              } transition-all duration-200`}
              onClick={handleSubmit}
            >
              {isReassign ? 'Reassign' : 'Approve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopicDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
  onApprove: () => void;
  onReassign: () => void;
}

const TopicDetailsModal: React.FC<TopicDetailsModalProps> = ({ isOpen, onClose, topic, onApprove, onReassign }) => {
  if (!isOpen || !topic) return null;

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
      case 'reassigned':
        return 'bg-orange-100 text-orange-800';
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
      case 'reassigned':
        return 'Reassigned';
      case 'complete':
        return 'Completed';
      case 'completed':
        return 'Completed';
      default:
        return status.replace('_', ' ');
    }
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto sm:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">{topic.name}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.topic_status)}`}>
                {getStatusText(topic.topic_status)}
              </span>
            </div>
            {topic.topic_duration_days && (
              <div>
                <span className="text-sm font-medium text-gray-600">Duration:</span>
                <span className="ml-2 text-sm text-gray-700">{topic.topic_duration_days} hours</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-600">Description:</span>
              <p className="text-sm text-gray-700 mt-1">{topic.description}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Subtopics:</span>
              {topic.subtopics && topic.subtopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topic.subtopics.map((subtopic, index) => {
                    const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                    const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                    const duration = durationMatch ? durationMatch[1] : null;
                    return (
                      <div key={index} className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-full border border-indigo-200 shadow-sm">
                        <span className="text-xs font-medium text-indigo-800">{name}</span>
                        {duration && (
                          <span className="ml-1 text-xs font-medium text-indigo-600 bg-white/50 px-1.5 py-0.5 rounded-full">
                            {duration}h
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-700 mt-1">No subtopics available.</p>
              )}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Importance:</span>
              <p className="text-sm text-gray-700 mt-1">{topic.importance}</p>
            </div>
          </div>
          {topic.topic_status === 'marked' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium transition-all duration-200"
              >
                Approve
              </button>
              <button
                onClick={onReassign}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm font-medium transition-all duration-200"
              >
                Reassign
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-medium text-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RoadmapOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapExplanation: string;
}

const RoadmapOverviewModal: React.FC<RoadmapOverviewModalProps> = ({ isOpen, onClose, roadmapExplanation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto sm:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Roadmap Overview</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{roadmapExplanation}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-medium text-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
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
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
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
      case 'reassigned':
        return 'bg-orange-100 text-orange-800';
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
      case 'reassigned':
        return 'Reassigned';
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
        setRoadmap(prev => {
          if (!prev) return null;
          return {
            ...prev,
            topics: prev.topics.map(t => 
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
        setRoadmap(prev => {
          if (!prev) return null;
          return {
            ...prev,
            topics: prev.topics.map(t => 
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

  const openTopicModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setTopicModalOpen(true);
  };

  const closeTopicModal = () => {
    setTopicModalOpen(false);
    setSelectedTopic(null);
  };

  const openRoadmapModal = () => {
    setRoadmapModalOpen(true);
  };

  const closeRoadmapModal = () => {
    setRoadmapModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading roadmap...</span>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-8">
        <p className="text-sm sm:text-base text-gray-600">No roadmap data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-[95vw] sm:max-w-6xl mx-auto p-4 sm:p-8 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 transition-colors duration-200 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Back
      </button>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 leading-tight">{mentee_name}'s Learning Roadmap</h1>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 shadow-sm border border-blue-100">
          <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Roadmap Overview</h2>
          <div className="sm:hidden">
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">{roadmap.roadmap_explanation}</p>
            <button
              onClick={openRoadmapModal}
              className="mt-2 inline-flex items-center px-2 py-1 bg-indigo-50 text-blue-600 rounded-md hover:bg-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-200 text-sm"
            >
              Read More
            </button>
          </div>
          <div className="hidden sm:block">
            <p className="text-base text-gray-700 leading-relaxed">{roadmap.roadmap_explanation}</p>
          </div>
        </div>
      </div>

      {roadmap.topics && roadmap.topics.length > 0 && (
        <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm sm:text-base font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm sm:text-base font-medium text-gray-700">
                {Math.round((roadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / roadmap.topics.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(roadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / roadmap.topics.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-purple-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-purple-700">{roadmap.topics.length}</div>
              <div className="text-xs sm:text-sm text-purple-600">Total Topics</div>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-green-700">
                {roadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length}
              </div>
              <div className="text-xs sm:text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-yellow-700">
                {roadmap.topics.filter(t => t.topic_status === 'marked').length}
              </div>
              <div className="text-xs sm:text-sm text-yellow-600">Marked</div>
            </div>
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="text-xl sm:text-2xl font-bold text-blue-700">
                {roadmap.topics.filter(t => t.topic_status === 'in_progress' || t.topic_status === 'assigned').length}
              </div>
              <div className="text-xs sm:text-sm text-blue-600">In Progress</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 sm:space-y-8">
        {roadmap.topics && roadmap.topics.length > 0 ? (
          <>
            <div className="sm:hidden space-y-3">
              {roadmap.topics.map((topic) => (
                <div 
                  key={topic.topic_id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <button
                    onClick={() => openTopicModal(topic)}
                    className="w-full text-left"
                  >
                    <div className="flex justify-between items-center min-w-0">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{topic.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.topic_status)}`}>
                            {getStatusText(topic.topic_status)}
                          </span>
                          {topic.topic_duration_days && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {topic.topic_duration_days} hours
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div className="hidden sm:block space-y-6">
              {roadmap.topics.map((topic) => (
                <div 
                  key={topic.topic_id} 
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02]"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 truncate">{topic.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(topic.topic_status)} group-hover:shadow-sm transition-all duration-300`}>
                          {getStatusText(topic.topic_status)}
                        </span>
                        {topic.topic_duration_days && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {topic.topic_duration_days} hours
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{topic.description}</p>
                      {topic.subtopics && topic.subtopics.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Subtopics:</h3>
                          <div className="flex flex-wrap gap-2">
                            {topic.subtopics.map((subtopic, index) => {
                              const durationMatch = subtopic.match(/\((\d+)\s*hours\)/);
                              const name = subtopic.replace(/\s*\(\d+\s*hours\)$/, '');
                              const duration = durationMatch ? durationMatch[1] : null;
                              return (
                                <div key={index} className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm">
                                  <span className="text-sm font-medium text-indigo-800">{name}</span>
                                  {duration && (
                                    <span className="ml-2 text-xs font-medium text-indigo-600 bg-white/50 px-2 py-0.5 rounded-full">
                                      {duration}h
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
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
                          className="p-3 text-green-500 hover:text-green-600 transition-colors duration-200 hover:scale-110"
                          title="Approve"
                        >
                          <CheckCircle className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => openModal(topic, true)}
                          className="p-3 text-yellow-500 hover:text-yellow-600 transition-colors duration-200 hover:scale-110"
                          title="Reassign"
                        >
                          <RefreshCw className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm sm:text-base text-gray-600">No topics available</p>
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

      <TopicDetailsModal
        isOpen={topicModalOpen}
        onClose={closeTopicModal}
        topic={selectedTopic}
        onApprove={() => selectedTopic && openModal(selectedTopic, false)}
        onReassign={() => selectedTopic && openModal(selectedTopic, true)}
      />

      <RoadmapOverviewModal
        isOpen={roadmapModalOpen}
        onClose={closeRoadmapModal}
        roadmapExplanation={roadmap.roadmap_explanation}
      />
    </div>
  );
};

export default MenteeRoadmapView;