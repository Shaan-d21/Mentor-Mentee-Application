import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Phone, Github, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '~/config/api';

interface Mentee {
  mentee_id: number;
  mentee_name: string;
  email: string;
  contact: string;
  github_id: string;
  experience: string;
  skills: string[];
}

const MyMentees: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentees, setMentees] = useState<Mentee[]>([]);

  // Fetch approved mentees
  const fetchMentees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/mentor/get-approved-mentee');
      if (response.status === 200) {
        setMentees(response.data.object);
      }
    } catch (error: any) {
      console.error('Error fetching mentees:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/auth/login');
      } else {
        toast.error('Failed to load mentees');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentees();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading mentees...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Mentees</h1>
        <button
          onClick={fetchMentees}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {mentees.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {mentees.map((mentee) => (
            <div key={mentee.mentee_id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{mentee.mentee_name}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{mentee.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{mentee.contact}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Github className="h-4 w-4 mr-2" />
                      <span>{mentee.github_id}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{mentee.experience}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentee.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No mentees assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default MyMentees; 