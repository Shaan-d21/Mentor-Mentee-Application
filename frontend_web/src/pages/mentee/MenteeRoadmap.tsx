import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRightIcon, BookOpenIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { FaUserTie } from 'react-icons/fa';

interface Mentor {
  mentor_id: number;
  mentor_name: string;
  domain: string;
  domain_id: number;
  has_roadmap: boolean;
  roadmap_id: number | null;
}

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

const MenteeRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast.error('Please login to view your roadmaps');
        navigate('/auth/login');
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentee/mentor-roadmap-details`,
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data && response.data.object) {
        const mappedMentors = response.data.object.map((mentor: any) => ({
          mentor_id: mentor.mentor_id,
          mentor_name: mentor.mentor_name,
          domain: mentor.domain_name,
          domain_id: mentor.domain_id,
          has_roadmap: mentor.roadmap_id !== null,
          roadmap_id: mentor.roadmap_id
        }));
        setMentors(mappedMentors);

        // If there's only one mentor with a roadmap, automatically select it
        const mentorsWithRoadmap = mappedMentors.filter((mentor: Mentor) => mentor.has_roadmap);
        if (mentorsWithRoadmap.length === 1) {
          fetchRoadmapTopics(mentorsWithRoadmap[0]);
        }
      } else {
        setError('No mentor data found in response');
      }
    } catch (err: any) {
      console.error('Error fetching mentors:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        navigate('/auth/login');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch mentors. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmapTopics = async (mentor: Mentor) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast.error('Please login to view roadmap topics');
        return;
      }

      // First check if the mentor has a roadmap
      if (!mentor.has_roadmap) {
        toast.error('No roadmap has been assigned by this mentor yet');
        return;
      }

      // Get the roadmap_id from the mentor data
      const mentorData = mentors.find(m => m.mentor_id === mentor.mentor_id);
      if (!mentorData) {
        toast.error('Mentor data not found');
        return;
      }

      console.log('Fetching roadmap topics for mentor:', mentorData);
      console.log('Roadmap ID:', mentorData.roadmap_id);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentee/roadmap-topics/${mentorData.roadmap_id}`,
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Raw API response:', response);
      console.log('Response data:', response.data);

      if (response.data && response.data.status_code === 200) {
        console.log('Setting roadmap data:', response.data);
        setSelectedRoadmap(response.data);
        toast.success('Roadmap loaded successfully');
      } else {
        console.log('Invalid response format:', response.data);
        toast.error('No roadmap has been assigned yet');
      }
    } catch (error) {
      console.error('Error fetching roadmap topics:', error);
      if (axios.isAxiosError(error)) {
        console.log('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 404) {
          toast.error('No roadmap found for this mentor');
          // Update the mentor's has_roadmap status
          setMentors(prevMentors => 
            prevMentors.map(m => 
              m.mentor_id === mentor.mentor_id 
                ? { ...m, has_roadmap: false }
                : m
            )
          );
        } else {
          toast.error(error.response?.data?.message || 'No roadmap has been assigned yet');
        }
      } else {
        toast.error('No roadmap has been assigned yet');
      }
    }
  };

  const handleMarkComplete = async (topic: Topic) => {
    setSelectedTopic(topic);
    setShowConfirmation(true);
  };

  const confirmMarkComplete = async () => {
    if (!selectedTopic) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please login to mark topics as complete');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/progress/mark_done`,
        { topic_id: selectedTopic.topic_id },
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.status_code === 200) {
        if (selectedRoadmap) {
          const updatedTopics = selectedRoadmap.topics.map(topic => 
            topic.topic_id === selectedTopic.topic_id 
              ? { ...topic, topic_status: 'marked' }
              : topic
          );
          setSelectedRoadmap({ ...selectedRoadmap, topics: updatedTopics });
        }
        toast.success('Topic is marked as complete');
      } else {
        toast.error('Failed to mark topic as complete');
      }
    } catch (error) {
      console.error('Error marking topic as complete:', error);
      toast.error('Failed to mark topic as complete');
    } finally {
      setShowConfirmation(false);
      setSelectedTopic(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Learning Roadmaps</h1>

        {mentors.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaUserTie className="mx-auto h-12 w-12 mb-4" />
            <p>You don't have any mentors yet.</p>
          </div>
        ) : selectedRoadmap ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <button
              onClick={() => setSelectedRoadmap(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 cursor-pointer"
            >
              <ChevronRightIcon className="h-5 w-5 transform rotate-180 mr-2" />
              Back
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Roadmap Overview</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                <p className="text-gray-700 leading-relaxed">{selectedRoadmap.roadmap_explanation}</p>
              </div>
            </div>

            {/* Progress Overview Section */}
            {selectedRoadmap?.topics && selectedRoadmap.topics.length > 0 && (
              <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h2>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round((selectedRoadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / selectedRoadmap.topics.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(selectedRoadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length / selectedRoadmap.topics.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">{selectedRoadmap.topics.length}</div>
                    <div className="text-sm text-purple-600">Total Topics</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {selectedRoadmap.topics.filter(t => t.topic_status === 'complete' || t.topic_status === 'completed').length}
                    </div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-700">
                      {selectedRoadmap.topics.filter(t => t.topic_status === 'marked').length}
                    </div>
                    <div className="text-sm text-yellow-600">Marked</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {selectedRoadmap.topics.filter(t => t.topic_status === 'in_progress' || t.topic_status === 'assigned').length}
                    </div>
                    <div className="text-sm text-blue-600">In Progress</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {selectedRoadmap.topics?.map((topic) => (
                <div 
                  key={topic.topic_id} 
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {topic.topic_status !== 'marked' && topic.topic_status !== 'complete' && topic.topic_status !== 'completed' && (
                          <button
                            onClick={() => handleMarkComplete(topic)}
                            className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                            title="Mark as complete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 hidden group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">{topic.name}</h2>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.mentor_id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ${
                  mentor.has_roadmap ? 'hover:shadow-lg' : 'opacity-75'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <BookOpenIcon className="h-6 w-6 text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">{mentor.domain}</h2>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      Mentor: <span className="font-medium">{mentor.mentor_name}</span>
                    </p>
                    <p className="text-gray-600">
                      Domain: <span className="font-medium">{mentor.domain}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => fetchRoadmapTopics(mentor)}
                    className={`w-full py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center cursor-pointer ${
                      mentor.has_roadmap
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!mentor.has_roadmap}
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {mentor.has_roadmap ? 'View Roadmap' : 'No Roadmap Assigned'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && selectedTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Topic as Complete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark "{selectedTopic.name}" as complete?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteeRoadmap; 