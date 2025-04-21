import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '~/config/api';
import { FaGithub, FaEnvelope, FaPhone, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Mentor {
  mentor_id: number;
  mentor_name: string;
  email: string;
  contact: string;
  github_id: string;
  experience: string;
  skills: string[];
  domain: string;
}

const ApprovedMentors: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedMentors = async () => {
      try {
        setLoading(true);
        console.log('Debug: Fetching approved mentors...');
        const response = await api.get(`${import.meta.env.VITE_API_URL}/mentee/get-approved-mentors`);
        console.log('Debug: API Response:', response.data);
        
        if (response.data.status_code === 200) {
          console.log('Debug: Setting mentors:', response.data.mentors);
          setMentors(response.data.mentors);
        } else {
          console.error('Debug: API returned non-200 status code:', response.data);
          setError('Failed to fetch approved mentors');
        }
      } catch (err) {
        console.error('Debug: Error fetching approved mentors:', err);
        setError('Failed to load approved mentors. Please try again later.');
        toast.error('Failed to load approved mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedMentors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="text-center p-8">
        <FaUserTie className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Approved Mentors</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have any approved mentors yet. Once a mentor accepts your request, they will appear here.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/mentee/find-mentors')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Find Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Mentors</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <div
            key={mentor.mentor_id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">{mentor.mentor_name}</h3>
              <p className="mt-1 text-sm text-gray-500">{mentor.domain}</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">{mentor.email}</span>
                </div>
                {mentor.contact && (
                  <div className="flex items-center">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">{mentor.contact}</span>
                  </div>
                )}
                {mentor.github_id && (
                  <div className="flex items-center">
                    <FaGithub className="h-5 w-5 text-gray-400" />
                    <a
                      href={`https://github.com/${mentor.github_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {mentor.github_id}
                    </a>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Experience</h4>
                  <p className="mt-1 text-sm text-gray-600">{mentor.experience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedMentors; 