import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
  topic_name: string;
}

const MenteeRoadmaps: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.error('No access token found in localStorage');
          setError('No access token found');
          return;
        }
        
        const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
        
        const response = await axios.get('http://181.214.44.15:8080/mentee/mentor-roadmap-details', {
          headers: {
            'Token': authToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        if (response.data) {
          if (response.data.object) {
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
            console.error('Response data.object is missing:', response.data);
            setError('No mentor data found in response');
          }
        } else {
          console.error('Response data is missing');
          setError('Invalid response from server');
        }
      } catch (err: any) {
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        
        if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
        } else {
          setError(err.response?.data?.message || 'Failed to fetch mentors. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname.includes('/roadmaps')) {
      fetchMentors();
    }
  }, [location.pathname]);

  const handleViewRoadmap = async (mentor: Mentor) => {
    try {
      setLoading(true);
      setSelectedMentor(mentor);
      setTopics([]); // Clear previous topics when switching mentors
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('No access token found');
        return;
      }
      
      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/mentee/roadmap-topics`, {
        mentor_id: mentor.mentor_id,
        domain_id: mentor.domain_id
      }, {
        headers: {
          'Token': authToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      if (response.data && response.data.roadmap_name) {
        // Split the roadmap name by newlines to create topics
        const topicNames = response.data.roadmap_name.split('\n').filter(Boolean);
        const topicsList = topicNames.map((name: string, index: number) => ({
          topic_id: index + 1,
          topic_name: name.trim()
        }));
        setTopics(topicsList);
      } else {
        setTopics([]); // Clear topics if no roadmap is found
        toast.error('No roadmap has been assigned by this mentor yet.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        });
      }
    } catch (err: any) {
      console.error('Error fetching roadmap:', err);
      setTopics([]); // Clear topics on error
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      } else if (err.response?.status === 404) {
        toast.error('No roadmap has been assigned by this mentor yet.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        });
      } else {
        toast.error(err.response?.data?.message || 'Failed to fetch roadmap. Please try again later.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  console.log('Rendering component with:', {
    loading,
    error,
    mentorsCount: mentors.length,
    selectedMentor: selectedMentor?.mentor_name,
    topicsCount: topics.length
  });

  if (!location.pathname.includes('/roadmaps')) {
    console.log('Not rendering - path does not include /roadmaps');
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
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
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">My Roadmaps</h2>
      {mentors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>You don't have any mentors yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {mentors.map((mentor) => (
            <div key={mentor.mentor_id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">{mentor.mentor_name}</h3>
                  <div className="flex flex-wrap gap-6 text-sm">
                    {mentor.designation && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Designation:</span>
                        <span className="text-gray-700 font-medium">{mentor.designation}</span>
                      </div>
                    )}
                    {mentor.domain && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Domain:</span>
                        <span className="text-gray-700 font-medium">{mentor.domain}</span>
                      </div>
                    )}
                    {mentor.experience && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Experience:</span>
                        <span className="text-gray-700 font-medium">{mentor.experience}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleViewRoadmap(mentor)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 self-start md:self-auto font-medium"
                >
                  View Roadmap
                </button>
              </div>
              
              {/* Topics section */}
              {selectedMentor?.mentor_id === mentor.mentor_id && topics.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-medium text-gray-700 mb-4">Topics</h4>
                  <div className="space-y-3 pl-4">
                    {topics.map((topic) => (
                      <div key={topic.topic_id} className="flex items-start">
                        <span className="text-gray-500 mr-3 font-medium">{topic.topic_id}.</span>
                        <span className="text-gray-700">{topic.topic_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenteeRoadmaps; 