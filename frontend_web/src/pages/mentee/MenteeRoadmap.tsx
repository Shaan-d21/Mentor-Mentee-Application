import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronRightIcon, BookOpenIcon, DocumentTextIcon, CheckCircleIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Mentor {
  mentor_id: number;
  mentor_name: string;
  email: string;
  designation: string;
  domain: string;
  domain_id: number;
  experience: string;
}

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

const MenteeRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(false);
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
          email: mentor.email,
          designation: mentor.designation,
          experience: mentor.experience,
          domain: mentor.domain_name,
          domain_id: mentor.domain_id
        }));
        setMentors(mappedMentors);
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
      setLoadingTopics(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast.error('Please login to view roadmap topics');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentee/roadmap-topics/${mentor.mentor_id}`,
        {
          headers: {
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.status_code === 200) {
        setSelectedRoadmap(response.data);
      } else {
        toast.error('Failed to fetch roadmap topics');
      }
    } catch (error) {
      console.error('Error fetching roadmap topics:', error);
      toast.error('Failed to fetch roadmap topics');
    } finally {
      setLoadingTopics(false);
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

      const response = await axios.post(
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
          const updatedTopics = selectedRoadmap.topic.map(topic => 
            topic.topic_id === selectedTopic.topic_id 
              ? { ...topic, topic_status: 'marked' }
              : topic
          );
          setSelectedRoadmap({ ...selectedRoadmap, topic: updatedTopics });
        }
        toast.success('Topic marked as complete');
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

        {selectedRoadmap ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <button
              onClick={() => setSelectedRoadmap(null)}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ChevronRightIcon className="h-5 w-5 transform rotate-180 mr-1" />
              Back to Roadmaps
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Roadmap Overview</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedRoadmap.roadmap_explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedRoadmap.topic.map((topic) => (
                <div key={topic.topic_id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleMarkComplete(topic)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                            topic.topic_status === 'marked'
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                          disabled={topic.topic_status === 'marked'}
                        >
                          {topic.topic_status === 'marked' && (
                            <CheckIcon className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{topic.name}</h3>
                          <p className="text-gray-600 mb-4">{topic.description}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 ml-12">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Subtopics</h4>
                        <div className="flex flex-wrap gap-2">
                          {topic.subtopics.map((subtopic, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                              {subtopic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg ml-12">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Importance:</span> {topic.importance}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        topic.topic_status === 'marked' 
                          ? 'bg-green-100 text-green-800' 
                          : topic.topic_status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.topic_status === 'marked' ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Completed
                          </>
                        ) : topic.topic_status === 'assigned' ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Assigned
                          </>
                        ) : (
                          'Pending'
                        )}
                      </span>
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
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                      Designation: <span className="font-medium">{mentor.designation}</span>
                    </p>
                    <p className="text-gray-600">
                      Experience: <span className="font-medium">{mentor.experience}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => fetchRoadmapTopics(mentor)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    View Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && selectedTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Topic as Complete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark "{selectedTopic.name}" as complete?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedTopic(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Yes, Mark Complete
                </button>
              </div>
            </div>
          </div>
        )}

        {loadingTopics && (
          <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenteeRoadmap; 