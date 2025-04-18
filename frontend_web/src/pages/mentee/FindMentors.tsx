import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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

const FindMentors: React.FC = () => {
  const navigate = useNavigate();
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
      
      console.log('Fetching requests from:', `${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/mentee/Requests`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/mentee/Requests`,
        {
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Requests response:', response.data);
      
      // Handle both response formats: array of requests or object with object property
      let requests: MentorshipRequest[] = [];
      
      if (Array.isArray(response.data)) {
        // Response is an array of requests
        requests = response.data as MentorshipRequest[];
      } else if (response.data && response.data.object) {
        // Response is an object with an object property
        requests = response.data.object as MentorshipRequest[];
      }
      
      console.log('All requests:', requests);
      
      // Extract mentor IDs from all requests (both pending and approved)
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
      
      console.log('Pending domains before update:', pendingDomains);
      console.log('Approved domains before update:', approvedDomains);
      
      setPendingRequestDomains(pendingDomains);
      setApprovedRequestDomains(approvedDomains);
      
      console.log('Pending domains updated:', pendingDomains);
      console.log('Approved domains updated:', approvedDomains);
      
      // If we have a selected domain and it's in the pending domains, hide the results
      if (compatibilityDomain && (pendingDomains.has(compatibilityDomain) || approvedDomains.has(compatibilityDomain))) {
        setShowCompatibilityResults(false);
        if (pendingDomains.has(compatibilityDomain)) {
          showErrorToast(`You already have a pending request for ${compatibilityDomain}`);
        } else {
          showErrorToast(`You already have an approved mentorship for ${compatibilityDomain}`);
        }
      }
    } catch (err) {
      console.error('Error fetching active requests:', err);
      // Don't show error toast to avoid spamming the user
      // Just log the error and continue
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
      showErrorToast(`You already have a pending request for ${compatibilityDomain}`);
      setShowCompatibilityResults(false);
      return;
    }
    
    // Check if there's already an approved mentorship for this domain
    if (approvedRequestDomains.has(compatibilityDomain)) {
      showErrorToast(`You already have an approved mentorship for ${compatibilityDomain}`);
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
      console.log('Using API URL:', import.meta.env.VITE_API_URL || 'https://mm-be.shaandewang.publicvm.com');
      
      const response = await axios.get(
        `${import.meta.env.VITE_AI_API_URL || 'https://mm-be.shaandewang.publicvm.com'}/predict`,
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
            experience: mentor.exp || 0
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
            experience: mentor.exp || 0
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
  // const handleSendRequest = async (mentorId: string) => {
  //   if (!compatibilityDomain) {
  //     showErrorToast('Domain information missing');
  //     return;
  //   }

  //   // Check if there's already a pending request for this domain
  //   if (pendingRequestDomains.has(compatibilityDomain)) {
  //     showErrorToast(`You already have a pending request for ${compatibilityDomain}`);
  //     return;
  //   }
    
  //   // Check if there's already an approved mentorship for this domain
  //   if (approvedRequestDomains.has(compatibilityDomain)) {
  //     showErrorToast(`You already have an approved mentorship for ${compatibilityDomain}`);
  //     return;
  //   }

  //   setRequestingMentorId(mentorId);

  //   try {
  //     const accessToken = localStorage.getItem('accessToken');
      
  //     if (!accessToken) {
  //       throw new Error('No access token found');
  //     }
      
  //     const authToken = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
      
  //     console.log('Sending mentorship request for domain:', compatibilityDomain);
      
  //     await axios.post(
  //       'http://181.214.44.15:8080/mentee/mentorship',
  //       {
  //         mentor_id: mentorId,
  //         domain: compatibilityDomain
  //       },
  //       {
  //         headers: { 
  //           Token: authToken,
  //           'Content-Type': 'application/json'
  //         },
  //         withCredentials: true
  //       }
  //     );
      
  //     // Add the mentor to requested mentors set
  //     setRequestedMentorIds(prev => new Set([...prev, mentorId]));
      
  //     // Add the domain to pending domains
  //     const updatedDomains = new Set(pendingRequestDomains);
  //     updatedDomains.add(compatibilityDomain);
  //     setPendingRequestDomains(updatedDomains);
      
  //     // Also fetch fresh data from server
  //     await fetchActiveRequests();
      
  //     // Remove the pending request error message
  //     toast.dismiss();
  //     toast.success(`Mentorship request sent for ${compatibilityDomain}`);
  //   } catch (err: any) {
  //     console.error('Error sending mentorship request:', err);
  //     if (err.response?.status === 409) {
  //       showErrorToast('You already have a pending request for this domain');
  //       // Update pending domains in case the local state is out of sync
  //       const updatedDomains = new Set(pendingRequestDomains);
  //       updatedDomains.add(compatibilityDomain);
  //       setPendingRequestDomains(updatedDomains);
  //     } else if (err.code === 'ERR_NETWORK') {
  //       showErrorToast('Network error. Please check your connection and try again.');
  //     } else {
  //       showErrorToast('Failed to send request. Please try again.');
  //     }
  //   } finally {
  //     setRequestingMentorId(null);
  //   }
  // };

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
  const handleViewCompatibilityReport = (mentorId: string, score: number) => {
    navigate('/mentee/compatibility-report', {
      state: { 
        mentorId, 
        score,
        domain: compatibilityDomain // Pass the selected domain
      }
    });
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-300"
            onClick={handleCheckCompatibility}
            disabled={isCheckingCompatibility || !compatibilityDomain || 
              pendingRequestDomains.has(compatibilityDomain) || 
              approvedRequestDomains.has(compatibilityDomain)}
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
                            onClick={() => mentor.id && handleViewCompatibilityReport(mentor.id, mentor.score)}
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
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
    </div>
  );
};

export default FindMentors; 