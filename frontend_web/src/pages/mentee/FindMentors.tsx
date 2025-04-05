import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

// Interface for compatibility results
interface CompatibleMentor {
  name: string;
  email: string;
  designation: string;
  tech_stack: string[];
  score: number;
  reason: string;
  id?: number; // Adding optional ID for identifying mentors
}

// Mock compatibility data
const MOCK_COMPATIBLE_MENTORS: CompatibleMentor[] = [
  {
    name: "John Smith",
    email: "john.smith@example.com",
    designation: "Senior Software Engineer",
    tech_stack: ["Python", "Django", "PostgreSQL"],
    score: 98,
    reason: "Strong expertise in Database & Backend development with 8+ years of experience"
  },
  {
    name: "Amelia Johnson",
    email: "amelia.j@example.com",
    designation: "Database Architect",
    tech_stack: ["MySQL", "MongoDB", "Redis", "SQL"],
    score: 95,
    reason: "Database specialist with experience in both SQL and NoSQL technologies"
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    designation: "Backend Developer",
    tech_stack: ["Node.js", "Express", "MySQL", "GraphQL"],
    score: 91,
    reason: "Specialized in API development and database optimization"
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    designation: "Full Stack Developer",
    tech_stack: ["Java", "Spring Boot", "Oracle", "Microservices"],
    score: 87,
    reason: "Experience in enterprise-level database architectures and backend systems"
  },
  {
    name: "David Rodriguez",
    email: "david.r@example.com",
    designation: "Database Administrator",
    tech_stack: ["PostgreSQL", "MySQL", "SQL Server", "Database Optimization"],
    score: 83,
    reason: "Deep understanding of database performance tuning and administration"
  }
];

// Hardcoded domains list
const DOMAINS = [
  'Programming Languages',
  'Database & Backend',
  'Cloud Computing',
  'DevOps & Deployment',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Software Development',
  'Project & Team Management',
  'Soft Skills',
  'Web Development',
];

const FindMentors: React.FC = () => {
  // Track if we're on the dashboard home or dedicated page
  const location = useLocation();
  const isOnDashboardHome = location.pathname === '/mentee/dashboard' || location.pathname === '/mentee/dashboard/';
  
  // States for compatibility check
  const [compatibilityDomain, setCompatibilityDomain] = useState<string>('');
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [compatibleMentors, setCompatibleMentors] = useState<CompatibleMentor[]>([]);
  const [showCompatibilityResults, setShowCompatibilityResults] = useState(false);
  
  // New states for mentor requests
  const [pendingRequestDomains, setPendingRequestDomains] = useState<Set<string>>(new Set());
  const [requestingMentorId, setRequestingMentorId] = useState<number | null>(null);

  // Load pending request domains from localStorage on component mount
  useEffect(() => {
    const savedDomains = localStorage.getItem('pendingMentorshipDomains');
    if (savedDomains) {
      setPendingRequestDomains(new Set(JSON.parse(savedDomains)));
    }
  }, []);

  // Save pending request domains to localStorage whenever they change
  useEffect(() => {
    if (pendingRequestDomains.size > 0) {
      localStorage.setItem('pendingMentorshipDomains', JSON.stringify([...pendingRequestDomains]));
    }
  }, [pendingRequestDomains]);

  // Handle checking compatibility
  const handleCheckCompatibility = async () => {
    if (!compatibilityDomain) {
      toast.error('Please select a domain for compatibility check');
      return;
    }

    setIsCheckingCompatibility(true);
    setShowCompatibilityResults(false);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      try {
        // Try to call the real API
        const response = await axios.post(
          `${apiBaseUrl}/matching/predict`,
          {
            choise: compatibilityDomain
          },
          {
            headers: { 
              Authorization: authToken,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Assuming the response has the format we need
        const mentorsWithIds = response.data?.map((mentor: any, index: number) => ({
          ...mentor,
          id: mentor.id || index + 1 // Use existing ID or generate a temporary one
        })) || [];
        
        setCompatibleMentors(mentorsWithIds);
      } catch (apiError) {
        console.log('API error, using mock data:', apiError);
        // If the API call fails, use mock data
        let mockData = [...MOCK_COMPATIBLE_MENTORS];
        
        // Add IDs to mock data
        mockData = mockData.map((mentor, index) => ({
          ...mentor,
          id: index + 1
        }));
        
        // Sort by score
        mockData.sort((a, b) => b.score - a.score);
        
        setCompatibleMentors(mockData);
      }
      
      setShowCompatibilityResults(true);
    } catch (err: any) {
      console.error('Error checking compatibility:', err);
      toast.error('Failed to check compatibility. Please try again.');
    } finally {
      setIsCheckingCompatibility(false);
    }
  };

  // Handle sending mentorship request
  const handleSendRequest = async (mentorId: number) => {
    if (!compatibilityDomain) {
      toast.error('Domain information missing');
      return;
    }

    setRequestingMentorId(mentorId);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      try {
        await axios.post(
          `${apiBaseUrl}/mentee/mentorship`,
          {
            mentor_id: mentorId,
            domain: compatibilityDomain
          },
          {
            headers: { 
              Authorization: authToken,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update pending domains
        const updatedDomains = new Set(pendingRequestDomains);
        updatedDomains.add(compatibilityDomain);
        setPendingRequestDomains(updatedDomains);
        
        toast.success(`Mentorship request sent for ${compatibilityDomain}`);
      } catch (apiError: any) {
        console.error('API error sending request:', apiError);
        if (apiError.response?.status === 409) {
          toast.error('You already have a pending request for this domain');
          // Update pending domains in case the local state is out of sync
          const updatedDomains = new Set(pendingRequestDomains);
          updatedDomains.add(compatibilityDomain);
          setPendingRequestDomains(updatedDomains);
        } else {
          toast.error('Failed to send request. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error sending mentorship request:', err);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setRequestingMentorId(null);
    }
  };

  // Check if a request is already pending for the current domain
  const isDomainPending = compatibilityDomain && pendingRequestDomains.has(compatibilityDomain);

  return (
    <div className={`container mx-auto ${!isOnDashboardHome ? 'p-6' : 'p-0 mt-8'}`}>
      {/* Conditional heading based on whether we're on dashboard or standalone page */}
      <h2 className={`${isOnDashboardHome ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>
        {isOnDashboardHome ? 'Find Mentors' : 'Find Mentors'}
      </h2>
      
      {/* Compatibility Check Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <p className="text-gray-600 mb-4">
          Select a domain of interest to find mentors who are most compatible with your learning goals.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Domain
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={compatibilityDomain}
              onChange={(e) => setCompatibilityDomain(e.target.value)}
            >
              <option value="">Select a domain</option>
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-300"
            onClick={handleCheckCompatibility}
            disabled={isCheckingCompatibility || !compatibilityDomain}
          >
            {isCheckingCompatibility ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Checking...
              </>
            ) : (
              <>
                <Check size={18} className="mr-2" />
                Check Compatibility
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Compatibility Results */}
      {showCompatibilityResults && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Compatible Mentors for {compatibilityDomain}</h3>
          
          {isDomainPending && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-700">
                You already have a pending mentorship request for this domain. You cannot send additional requests until the current one is processed.
              </p>
            </div>
          )}
          
          {compatibleMentors.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tech Stack
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compatibility Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compatibleMentors.map((mentor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{mentor.designation}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {mentor.tech_stack.map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-semibold ${
                            mentor.score >= 90 ? 'text-green-600' : 
                            mentor.score >= 70 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {mentor.score}%
                          </span>
                          <Star 
                            size={16} 
                            className={`ml-1 ${
                              mentor.score >= 90 ? 'text-green-600 fill-green-600' : 
                              mentor.score >= 70 ? 'text-yellow-600 fill-yellow-600' : 'text-gray-600'
                            }`} 
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{mentor.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => mentor.id && handleSendRequest(mentor.id)}
                          disabled={isDomainPending || requestingMentorId === mentor.id}
                          className={`px-3 py-1 rounded flex items-center text-sm ${
                            isDomainPending
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : requestingMentorId === mentor.id
                              ? 'bg-blue-100 text-blue-400 cursor-wait'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {requestingMentorId === mentor.id ? (
                            <>
                              <div className="animate-spin mr-1 h-3 w-3 border-2 border-blue-200 border-t-transparent rounded-full"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={14} className="mr-1" />
                              {isDomainPending ? 'Request Sent' : 'Send Request'}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No compatible mentors found for this domain. Try selecting a different domain.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindMentors; 