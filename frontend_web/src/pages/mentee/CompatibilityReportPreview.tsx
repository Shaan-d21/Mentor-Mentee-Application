import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface MentorData {
  name: string;
  email: string;
  designation: string;
  domain: string;
  tech_stack: string[];
  missing_skills: string[];
  summary: string;
}

export default function CompatibilityReportPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mentorId, score } = location.state || {};
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "#22C55E";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    if (score >= 20) return "#f97316";
    return "#ef4444";
  };

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/mentor/${mentorId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
          maxRedirects: 0
        });
        setMentorData(response.data);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast.error('Failed to load mentor data');
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorData();
    }
  }, [mentorId]);
  
  // Animate score on load with circular animation
  useEffect(() => {
    if (!score) return;
    
    let currentScore = 0;
    const targetScore = score;
    const increment = 1;
    const animationDuration = 1500; // ms
    const steps = targetScore / increment;
    const interval = animationDuration / steps;
    
    const timer = setInterval(() => {
      if (currentScore < targetScore) {
        currentScore += increment;
        setAnimatedScore(currentScore);
      } else {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [score]);

  const handleRequestMentorship = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/mentee/mentorship`,
        { 
          mentor_id: mentorId,
          domain: "Software Development"  // Placeholder domain
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true,
          maxRedirects: 0
        }
      );
      
      if (response.status === 200) {
        toast.success('Mentorship request sent successfully');
        navigate('/mentee/find-mentors');
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Failed to send mentorship request');
    }
  };
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!mentorData) {
    return <div className="min-h-screen flex items-center justify-center">No mentor data available</div>;
  }
  
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Close Button - Now more prominent in the content area */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Compatibility Score Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-28 h-28 mr-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Progress Circle with Dynamic Color and Animation */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={getScoreColor(animatedScore)}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40 * animatedScore/100} ${2 * Math.PI * 40}`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
                {/* Percentage Text */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={getScoreColor(animatedScore)}
                  fontSize="22"
                  fontWeight="bold"
                >
                  {animatedScore}%
                </text>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Compatibility</h2>
              <p className="text-gray-500">with {mentorData.name}</p>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                {animatedScore >= 80 ? "Excellent Match" : 
                 animatedScore >= 60 ? "Good Match" : 
                 animatedScore >= 40 ? "Moderate Match" : 
                 animatedScore >= 20 ? "Low Match" : "Poor Match"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mentor Details Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Mentor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-3">
                <span className="text-gray-500 block text-sm">Name</span>
                <span className="text-gray-800 font-medium">{mentorData.name}</span>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 block text-sm">Email</span>
                <span className="text-gray-800">{mentorData.email}</span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <span className="text-gray-500 block text-sm">Designation</span>
                <span className="text-gray-800">{mentorData.designation}</span>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 block text-sm">Domain</span>
                <span className="text-gray-800">{mentorData.domain}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills Match Section - Updated Design */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills Match</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Skills */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-green-800 font-medium mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentorData.tech_stack.map((skill: string, index: number) => (
                  <div key={index} className="bg-white text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Missing Skills */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-amber-800 font-medium mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentorData.missing_skills?.map((skill: string, index: number) => (
                  <div key={index} className="bg-white text-amber-700 px-3 py-1 rounded-full text-sm border border-amber-200 shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="bg-blue-500 px-6 py-3">
            <h2 className="text-lg font-semibold text-white">Summary Assessment</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed font-medium">{mentorData.summary || 'No summary available'}</p>
          </div>
        </div>
        
        {/* Action Button - Request Mentorship */}
        <div className="mt-6">
          <button 
            onClick={handleRequestMentorship}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Request Mentorship
          </button>
        </div>
      </div>
    </div>
  );
} 