import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check } from 'lucide-react';
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
  id?: string; // Changed to string to match the response format
  domain?: string; // Added domain field
  experience?: number;
  request_status?: 'pending' | 'accepted' | 'rejected';
}

// Hardcoded domains list - updated to match the FastAPI Domains enum
const DOMAINS = [
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

interface MentorshipRequest {
  domain: string;
  domain_name: string;
  status: 'pending' | 'not approved' | 'approved';
  mentor_id: string;
}

interface MentorData {
  e_skills: string[];
  m_skills: string[];
  summary: string;
}

// Add these constants at the top of the file
// const API_URL = import.meta.env.VITE_API_URL ;
// const AI_API_URL = import.meta.env.VITE_AI_API_URL;

// Add the AnimatedCircularProgress component
const AnimatedCircularProgress: React.FC<{
  size: number;
  width: number;
  fill: number;
  tintColor: string;
  backgroundColor?: string;
  children?: (fill: number) => React.ReactNode;
}> = ({ size, width, fill, tintColor, backgroundColor = '#E0E0E0', children }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const endValue = fill;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      
      setProgress(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [fill]);

  const center = size / 2;
  const radius = (size - width) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={width}
        />
        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={tintColor}
          strokeWidth={width}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {children && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          {children(progress)}
        </div>
      )}
    </div>
  );
};

const FindMentors: React.FC = () => {
  // Track if we're on the dashboard home or dedicated page
  const location = useLocation();
  const isOnDashboardHome = location.pathname === '/mentee/dashboard' || location.pathname === '/mentee/dashboard/';
  
  // States for compatibility check
  const [compatibilityDomain, setCompatibilityDomain] = useState<string>('');
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [compatibleMentors, setCompatibleMentors] = useState<CompatibleMentor[]>([]);
  const [showCompatibilityResults, setShowCompatibilityResults] = useState(false);
  const [toastCooldown, setToastCooldown] = useState<boolean>(false);
  
  // States for mentor requests
  const [pendingRequestDomains, setPendingRequestDomains] = useState<Set<string>>(new Set());
  const [approvedRequestDomains, setApprovedRequestDomains] = useState<Set<string>>(new Set());
  // const [requestingMentorId, setRequestingMentorId] = useState<string | null>(null);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestedMentorIds, setRequestedMentorIds] = useState<Set<string>>(new Set());
  const [selectedMentor, setSelectedMentor] = useState<CompatibleMentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(false);

  const showErrorToast = (message: string) => {
    if (!toastCooldown) {
      toast.error(message);
      setToastCooldown(true);
      setTimeout(() => {
        setToastCooldown(false);
      }, 5000);
    }
  };

  // Function to fetch active requests from the server
  const fetchActiveRequests = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No access token found, skipping fetchActiveRequests');
        return;
      }
      
      console.log('Fetching requests from:', `${import.meta.env.VITE_API_URL}/mentee/Requests`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mentee/Requests`,
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Requests response:', response.data);
      
      // Initialize empty arrays for requests
      let requests: MentorshipRequest[] = [];
      
      // Check if response.data is an object and has the expected structure
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          requests = response.data;
        } else if (response.data.object && Array.isArray(response.data.object)) {
          requests = response.data.object;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          requests = response.data.requests;
        }
      }
      
      console.log('Processed requests:', requests);
      
      // Extract mentor IDs from all requests
      const mentorIds = new Set(requests.map(req => req.mentor_id));
      setRequestedMentorIds(mentorIds);
      
      // Filter requests for pending status
      const pendingRequests = requests.filter(req => req.status === 'pending');
      console.log('Pending requests:', pendingRequests);
      
      // Filter requests for approved status
      const approvedRequests = requests.filter(req => req.status === 'approved');
      console.log('Approved requests:', approvedRequests);
      
      // Extract domains from pending requests
      const pendingDomains = new Set(
        pendingRequests.map(req => req.domain_name || req.domain)
      );
      
      // Extract domains from approved requests
      const approvedDomains = new Set(
        approvedRequests.map(req => req.domain_name || req.domain)
      );
      
      console.log('Pending domains:', pendingDomains);
      console.log('Approved domains:', approvedDomains);
      
      setPendingRequestDomains(pendingDomains);
      setApprovedRequestDomains(approvedDomains);
      
      // If we have a selected domain and it's in the pending domains, hide the results
      if (compatibilityDomain && (pendingDomains.has(compatibilityDomain) || approvedDomains.has(compatibilityDomain))) {
        setShowCompatibilityResults(false);
      }
    } catch (err) {
      console.error('Error fetching active requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Fetch active requests on component mount and periodically
  useEffect(() => {
    // Fetch immediately on component mount
    fetchActiveRequests();
    
    // Then fetch every 30 seconds
    const interval = setInterval(fetchActiveRequests, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle checking compatibility
  const handleCheckCompatibility = async () => {
    if (!compatibilityDomain) {
      showErrorToast('Please select a domain for compatibility check');
      return;
    }

    // Check if there's already a pending request for this domain
    if (pendingRequestDomains.has(compatibilityDomain)) {
      setShowCompatibilityResults(false);
      return;
    }
    
    // Check if there's already an approved mentorship for this domain
    if (approvedRequestDomains.has(compatibilityDomain)) {
      setShowCompatibilityResults(false);
      return;
    }

    setIsCheckingCompatibility(true);
    setShowCompatibilityResults(false);

    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      const trimmedDomain = compatibilityDomain.trim();
      
      console.log('Checking compatibility for domain:', trimmedDomain);
      console.log('Using API URL:', import.meta.env.VITE_API_URL);
      
      const response = await axios.get(
        `${import.meta.env.VITE_AI_API_URL}/predict/`,
        {
          params: {
            d: compatibilityDomain
          },
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Compatibility check response:', response.data);
      
      // Process the response data
      let domainMentorsList: CompatibleMentor[] = [];
      let otherMentorsList: CompatibleMentor[] = [];
      
      try {
        const data = response.data;
        const domainMentors = data.domain_mentors || [];
        const otherMentors = data.other_domain_mentors || [];
        
        domainMentors.forEach((mentor: any) => {
          domainMentorsList.push({
            name: mentor.name || '',
            email: mentor.mail || '',
            designation: mentor.designation || '',
            tech_stack: [],
            score: mentor.score || 0,
            reason: mentor.reason || 'No reason provided',
            id: mentor.id?.toString() || '',
            domain: mentor.domain || trimmedDomain,
            experience: mentor.exp || 0,
            request_status: undefined
          });
        });
        
        otherMentors.forEach((mentor: any) => {
          otherMentorsList.push({
            name: mentor.name || '',
            email: mentor.mail || '',
            designation: mentor.designation || '',
            tech_stack: [],
            score: mentor.score || 0,
            reason: mentor.reason || 'No reason provided',
            id: mentor.id?.toString() || '',
            domain: mentor.domain || 'Other',
            experience: mentor.exp || 0,
            request_status: undefined
          });
        });
        
        // Check again if there's a pending request for this domain before showing results
        if (pendingRequestDomains.has(trimmedDomain) || approvedRequestDomains.has(trimmedDomain)) {
          setShowCompatibilityResults(false);
          return;
        }
        
        setCompatibleMentors([...domainMentorsList, ...otherMentorsList]);
        setShowCompatibilityResults(true);
      } catch (e) {
        console.error('Failed to process response:', e);
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error checking compatibility:', err);
      showErrorToast('Failed to check compatibility. Please try again.');
    } finally {
      setIsCheckingCompatibility(false);
    }
  };

  // Handle sending mentorship request
  const handleSendRequest = async () => {
    if (!selectedMentor) return;

    try {
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_URL}/mentee/mentorship`,
        headers: {
          'Token': `${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          mentor_id: selectedMentor.id,
          domain: compatibilityDomain
        }
      });
      
      if (response.status === 200) {
        toast.success(`Mentorship request has been sent successfully to ${selectedMentor.name}`);
        closeModal();
        // Refresh the requests list
        fetchActiveRequests();
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Failed to send mentorship request');
    }
  };

  // Check if a request is already pending for the current domain
  const isDomainPending = compatibilityDomain && pendingRequestDomains.has(compatibilityDomain);
  
  // Check if a mentorship is already approved for the current domain
  const isDomainApproved = compatibilityDomain && approvedRequestDomains.has(compatibilityDomain);
  
  // Debug log to check the state
  useEffect(() => {
    console.log('Current domain:', compatibilityDomain);
    console.log('Pending domains:', pendingRequestDomains);
    console.log('Approved domains:', approvedRequestDomains);
    console.log('Is domain pending:', isDomainPending);
    console.log('Is domain approved:', isDomainApproved);
    
    // If the domain is pending or approved, hide the results
    if (isDomainPending || isDomainApproved) {
      setShowCompatibilityResults(false);
    }
  }, [compatibilityDomain, pendingRequestDomains, approvedRequestDomains, isDomainPending, isDomainApproved]);

  // Force a re-render when the component mounts to ensure buttons are properly styled
  useEffect(() => {
    // Fetch active requests immediately on component mount
    fetchActiveRequests();
  }, []);

  // Add a useEffect to hide compatibility results when a domain has a pending request
  useEffect(() => {
    if (compatibilityDomain && (pendingRequestDomains.has(compatibilityDomain) || approvedRequestDomains.has(compatibilityDomain))) {
      setShowCompatibilityResults(false);
    }
  }, [compatibilityDomain, pendingRequestDomains, approvedRequestDomains]);

  // Add a useEffect to check for pending requests when the component mounts
  useEffect(() => {
    // This will run once when the component mounts
    const checkPendingRequests = async () => {
      await fetchActiveRequests();
    };
    
    checkPendingRequests();
  }, []);

  const handleDomainSelect = (domain: string) => {
    setCompatibilityDomain(domain);
    setShowCompatibilityResults(false); // Clear previous results when switching domains
    setCompatibleMentors([]); // Clear the mentors list
  };

  // Add useEffect to ensure results are only shown after clicking the button
  useEffect(() => {
    // If domain changes, hide results
    setShowCompatibilityResults(false);
    setCompatibleMentors([]);
  }, [compatibilityDomain]);

  // Replace the send request button with a compatibility report link
  const handleViewCompatibilityReport = async (mentor: CompatibleMentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_API_URL}/matching_report`,
        {
          mentor_id: parseInt(mentor.id || ''),
          domain: compatibilityDomain,
          score: mentor.score
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      setMentorData(response.data);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      toast.error('Failed to load mentor data');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
  };

  return (
    <div className={`container mx-auto ${!isOnDashboardHome ? 'p-6' : 'p-0 mt-8'}`}>
      {/* Conditional heading based on whether we're on dashboard or standalone page */}
      <h2 className={`${isOnDashboardHome ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>
        {isOnDashboardHome ? 'Find Mentors' : 'Find Mentors'}
      </h2>
      
      {/* Loading indicator for active requests */}
      {isLoadingRequests && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center">
            <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}
      
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={compatibilityDomain}
              onChange={(e) => {
                handleDomainSelect(e.target.value);
              }}
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-300 cursor-pointer"
            onClick={handleCheckCompatibility}
            disabled={isCheckingCompatibility || !compatibilityDomain || 
              pendingRequestDomains.has(compatibilityDomain) || 
              approvedRequestDomains.has(compatibilityDomain)}
          >
            {isCheckingCompatibility ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Finding Mentors...
              </>
            ) : (
              <>
                <Check size={18} className="mr-2" />
                Find
              </>
            )}
          </button>
        </div>
        
        {/* Show message if domain has pending request or approved mentorship - below both dropdown and button */}
        {compatibilityDomain && (
          <div>
            {pendingRequestDomains.has(compatibilityDomain) && !approvedRequestDomains.has(compatibilityDomain) && (
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-700">
                  You already have a pending mentorship request for {compatibilityDomain}. You cannot send additional requests until the current one is processed.
                </p>
              </div>
            )}
            
            {approvedRequestDomains.has(compatibilityDomain) && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-700">
                  You already have an approved mentorship for {compatibilityDomain}. You cannot send additional requests for this domain.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Compatibility Results - Only show if there are no pending or approved requests for this domain */}
      {showCompatibilityResults && !pendingRequestDomains.has(compatibilityDomain) && !approvedRequestDomains.has(compatibilityDomain) && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Compatible Mentors for {compatibilityDomain}</h3>
          
          {/* Combined Mentors Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            {compatibleMentors.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compatibility Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {compatibleMentors
                    .filter(mentor => !requestedMentorIds.has(mentor.id || ''))
                    .map((mentor) => (
                      <tr key={mentor.id} className={mentor.domain === compatibilityDomain ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">{mentor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mentor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mentor.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{mentor.experience} years</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mentor.domain === compatibilityDomain 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {mentor.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewCompatibilityReport(mentor)}
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 transform hover:scale-105 cursor-pointer ${
                              mentor.score >= 90 ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                              mentor.score >= 70 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                              'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {mentor.score}%
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No compatible mentors found for {compatibilityDomain}.</p>
                <p className="text-sm text-gray-400 mt-2">Please try a different domain or check back later.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compatibility Report Modal */}
      {isModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-end">
          {/* Backdrop with fade effect */}
          <div 
            className="fixed inset-0 transition-opacity duration-500 ease-in-out"
            onClick={closeModal}
          />
          
          {/* Modal with slide effect */}
          <div 
            className={`bg-gray-50 w-full max-w-4xl h-screen overflow-y-auto transform transition-all duration-500 ease-in-out ${
              isModalOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={closeModal}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Content with fade-in effect */}
                  <div className={`transform transition-all duration-500 ease-in-out ${
                    loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}>
                    {/* Compatibility Score Section */}
                    <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex flex-col md:flex-row items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="mr-6">
                          <AnimatedCircularProgress
                            size={140}
                            width={15}
                            fill={selectedMentor.score}
                            tintColor={selectedMentor.score >= 90 ? "#22C55E" : selectedMentor.score >= 70 ? "#3b82f6" : "#f59e0b"}
                            backgroundColor="#E0E0E0"
                          >
                            {(fill) => (
                              <span className="text-2xl font-bold" style={{
                                color: selectedMentor.score >= 90 ? "#22C55E" : selectedMentor.score >= 70 ? "#3b82f6" : "#f59e0b"
                              }}>
                                {Math.round(fill)}%
                              </span>
                            )}
                          </AnimatedCircularProgress>
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">Compatibility Score</h2>
                          <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                            selectedMentor.score >= 90 ? "bg-green-100 text-green-800" :
                            selectedMentor.score >= 70 ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {selectedMentor.score >= 90 ? "Excellent Match" :
                             selectedMentor.score >= 70 ? "Strong Match" :
                             "Good Match"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills Match Section */}
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
                            {mentorData?.e_skills.map((skill, index) => (
                              <div key={index} className="bg-white text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 shadow-sm">
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Missing Skills */}
                        {mentorData?.m_skills && mentorData.m_skills.length > 0 && (
                          <div className="bg-amber-50 rounded-lg p-4">
                            <h3 className="text-amber-800 font-medium mb-3 flex items-center">
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Missing Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {mentorData.m_skills.map((skill, index) => (
                                <div key={index} className="bg-white text-amber-700 px-3 py-1 rounded-full text-sm border border-amber-200 shadow-sm">
                                  {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md mb-6 overflow-hidden">
                      <div className="bg-blue-500 px-6 py-3">
                        <h2 className="text-lg font-semibold text-white">Summary</h2>
                      </div>
                      <div className="p-6 space-y-3">
                        {Array.isArray(mentorData?.summary) ? (
                          mentorData.summary.map((point, index) => (
                            <div key={`summary-${index}`} className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                              <p className="ml-3 text-gray-700">{point}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No summary available</p>
                        )}
                      </div>
                    </div>

                    {/* Action Button - Request Mentorship */}
                    <div className="mt-6">
                      <button 
                        onClick={handleSendRequest}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center cursor-pointer"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Request Mentorship
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Update the customScrollbarStyles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = customScrollbarStyles;
document.head.appendChild(styleSheet);

export default FindMentors; 