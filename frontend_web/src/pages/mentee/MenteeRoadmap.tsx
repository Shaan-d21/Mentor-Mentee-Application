import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronRightIcon, BookOpenIcon, DocumentTextIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
        `${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/mentee/mentor-roadmap-details`,
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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/mentee/roadmap-topics/${mentorData.roadmap_id}`,
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
        setSelectedRoadmap(response.data);
        toast.success('Roadmap loaded successfully');
      } else {
        toast.error('No roadmap has been assigned yet');
      }
    } catch (error) {
      console.error('Error fetching roadmap topics:', error);
      if (axios.isAxiosError(error)) {
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
        `${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/progress/mark_done`,
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
              {selectedRoadmap?.topic?.map((topic) => (
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
                          {topic.subtopics?.map((subtopic, _) => (
                            <span
                              key={_}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {subtopic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="ml-12">
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-indigo-700">Importance:</span> {topic.importance}
                          </p>
                        </div>
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
                    className={`w-full py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center ${
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkComplete}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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