import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, Eye } from 'lucide-react';
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
  id?: string;
  domain?: string;
  experience?: number;
  request_status?: 'pending' | 'accepted' | 'rejected';
}

// Hardcoded domains list
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

// AnimatedCircularProgress component
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
    const duration = 2000;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = fill;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={backgroundColor}
          strokeWidth={width}
        />
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
  const location = useLocation();
  const isOnDashboardHome = location.pathname === '/mentee/dashboard' || location.pathname === '/mentee/dashboard/';
  
  const [compatibilityDomain, setCompatibilityDomain] = useState<string>('');
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  const [compatibleMentors, setCompatibleMentors] = useState<CompatibleMentor[]>([]);
  const [showCompatibilityResults, setShowCompatibilityResults] = useState(false);
  const [toastCooldown, setToastCooldown] = useState<boolean>(false);
  const [pendingRequestDomains, setPendingRequestDomains] = useState<Set<string>>(new Set());
  const [approvedRequestDomains, setApprovedRequestDomains] = useState<Set<string>>(new Set());
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestedMentorIds, setRequestedMentorIds] = useState<Set<string>>(new Set());
  const [selectedMentor, setSelectedMentor] = useState<CompatibleMentor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailsMentor, setSelectedDetailsMentor] = useState<CompatibleMentor | null>(null);

  const showErrorToast = (message: string) => {
    if (!toastCooldown) {
      toast.error(message);
      setToastCooldown(true);
      setTimeout(() => setToastCooldown(false), 5000);
    }
  };

  const fetchActiveRequests = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No access token found');
        return;
      }

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

      let requests: MentorshipRequest[] = [];
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          requests = response.data;
        } else if (response.data.object && Array.isArray(response.data.object)) {
          requests = response.data.object;
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          requests = response.data.requests;
        }
      }

      const mentorIds = new Set(requests.map(req => req.mentor_id));
      setRequestedMentorIds(mentorIds);

      const pendingRequests = requests.filter(req => req.status === 'pending');
      const approvedRequests = requests.filter(req => req.status === 'approved');

      const pendingDomains = new Set(pendingRequests.map(req => req.domain_name || req.domain));
      const approvedDomains = new Set(approvedRequests.map(req => req.domain_name || req.domain));

      setPendingRequestDomains(pendingDomains);
      setApprovedRequestDomains(approvedDomains);

      if (compatibilityDomain && (pendingDomains.has(compatibilityDomain) || approvedDomains.has(compatibilityDomain))) {
        setShowCompatibilityResults(false);
      }
    } catch (err) {
      console.error('Error fetching active requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchActiveRequests();
    const interval = setInterval(fetchActiveRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckCompatibility = async () => {
    if (!compatibilityDomain) {
      showErrorToast('Please select a domain for compatibility check');
      return;
    }

    if (pendingRequestDomains.has(compatibilityDomain) || approvedRequestDomains.has(compatibilityDomain)) {
      setShowCompatibilityResults(false);
      return;
    }

    setIsCheckingCompatibility(true);
    setShowCompatibilityResults(false);
    setCompatibleMentors([]);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_AI_API_URL}/predict/`,
        {
          params: { d: compatibilityDomain },
          headers: { 
            'Token': accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      let domainMentorsList: CompatibleMentor[] = [];
      let otherMentorsList: CompatibleMentor[] = [];

      const { domain_mentors = [], other_domain_mentors = [] } = response.data;

      domainMentorsList = domain_mentors.map((mentor: any) => ({
        name: mentor.name || '',
        email: mentor.mail || '',
        designation: mentor.designation || '',
        tech_stack: [],
        score: mentor.score || 0,
        reason: mentor.reason || 'No reason provided',
        id: mentor.id?.toString() || '',
        domain: mentor.domain || compatibilityDomain,
        experience: mentor.exp || 0,
        request_status: undefined
      }));

      otherMentorsList = other_domain_mentors.map((mentor: any) => ({
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
      }));

      if (pendingRequestDomains.has(compatibilityDomain) || approvedRequestDomains.has(compatibilityDomain)) {
        setShowCompatibilityResults(false);
        return;
      }

      setCompatibleMentors([...domainMentorsList, ...otherMentorsList]);
      setShowCompatibilityResults(true);
    } catch (err: any) {
      console.error('Error checking compatibility:', err);
      showErrorToast('Failed to check compatibility. Please try again.');
    } finally {
      setIsCheckingCompatibility(false);
    }
  };

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
        fetchActiveRequests();
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Failed to send mentorship request');
    }
  };

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

  const openDetailsModal = (mentor: CompatibleMentor) => {
    setSelectedDetailsMentor(mentor);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
    setMentorData(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDetailsMentor(null);
  };

  const handleDomainSelect = (domain: string) => {
    if (isCheckingCompatibility) return;
    setCompatibilityDomain(domain);
    setShowCompatibilityResults(false);
    setCompatibleMentors([]);
  };

  useEffect(() => {
    if (compatibilityDomain && (pendingRequestDomains.has(compatibilityDomain) || approvedRequestDomains.has(compatibilityDomain))) {
      setShowCompatibilityResults(false);
    }
  }, [compatibilityDomain, pendingRequestDomains, approvedRequestDomains]);

  return (
    <div className={`container mx-auto ${!isOnDashboardHome ? '' : 'p-0 mt-8'}`}>
      <h2 className={`${isOnDashboardHome ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>
        Find Mentors
      </h2>

      {isLoadingRequests && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-center">
            <div className="animate-spin mr-2 h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={compatibilityDomain}
              onChange={(e) => handleDomainSelect(e.target.value)}
              disabled={isCheckingCompatibility}
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
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

      {showCompatibilityResults && !pendingRequestDomains.has(compatibilityDomain) && !approvedRequestDomains.has(compatibilityDomain) && (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Compatible Mentors for {compatibilityDomain}</h3>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Domain
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {compatibleMentors.length > 0 ? (
                  compatibleMentors
                    .filter(mentor => !requestedMentorIds.has(mentor.id || ''))
                    .map((mentor) => (
                      <tr 
                        key={mentor.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${mentor.domain === compatibilityDomain ? 'bg-blue-50' : ''}`}
                        onClick={() => openDetailsModal(mentor)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900 max-w-[150px] truncate">
                          <span title={mentor.name}>{mentor.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600 max-w-[150px] truncate">
                          <span title={mentor.email}>{mentor.email}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600 max-w-[150px] truncate">
                          <span title={mentor.designation}>{mentor.designation}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600 max-w-[100px]">
                          {mentor.experience} years
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm max-w-[150px] truncate">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            mentor.domain === compatibilityDomain 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`} title={mentor.domain}>
                            {mentor.domain}
                          </span>
                        </td>
                        <td 
                          className="px-4 py-3 whitespace-nowrap text-center text-sm max-w-[100px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleViewCompatibilityReport(mentor)}
                            className={`flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer hover:shadow-md hover:scale-105 transform transition-all duration-200 ${
                              mentor.score >= 90
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : mentor.score >= 70
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            <Eye size={14} className="mr-1" />
                            {mentor.score}%
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                      No compatible mentors found for {compatibilityDomain}.
                      <p className="text-xs text-gray-400 mt-1">Please try a different domain or check back later.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {compatibleMentors.length > 0 ? (
              compatibleMentors
                .filter(mentor => !requestedMentorIds.has(mentor.id || ''))
                .map((mentor) => (
                  <div 
                    key={mentor.id} 
                    className={`py-3 px-2 hover:bg-gray-50 cursor-pointer ${mentor.domain === compatibilityDomain ? 'bg-blue-50' : ''}`}
                    onClick={() => openDetailsModal(mentor)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.designation}</p>
                        <p className="text-xs text-gray-500">{mentor.domain}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCompatibilityReport(mentor);
                        }}
                        className={`flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-full cursor-pointer hover:shadow-md hover:scale-105 transform transition-all duration-200 ${
                          mentor.score >= 90
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : mentor.score >= 70
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        <Eye size={14} className="mr-1" />
                        {mentor.score}%
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md text-center text-sm text-gray-500">
                No compatible mentors found for {compatibilityDomain}.
                <p className="text-xs text-gray-400 mt-1">Please try a different domain or check back later.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compatibility Report Modal */}
      {isModalOpen && selectedMentor && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-end">
          <div 
            className={`bg-gray-50 w-full max-w-4xl h-screen overflow-y-auto transform transition-all duration-500 ease-in-out ${
              isModalOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedMentor.name}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
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
                <div className={`transform transition-all duration-500 ease-in-out ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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

                  <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills Match</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="mt-6">
                    <button 
                      onClick={handleSendRequest}
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDetailsMentor && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base font-semibold text-gray-900">Mentor Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <p className="text-gray-900">{selectedDetailsMentor.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{selectedDetailsMentor.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Designation:</span>
                <p className="text-gray-900">{selectedDetailsMentor.designation}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Domain:</span>
                <p className="text-gray-900">{selectedDetailsMentor.domain}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Experience:</span>
                <p className="text-gray-900">{selectedDetailsMentor.experience} years</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Compatibility Score:</span>
                <p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedDetailsMentor.score >= 90 ? 'bg-green-100 text-green-800' :
                    selectedDetailsMentor.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedDetailsMentor.score}%
                  </span>
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Reason:</span>
                <p className="text-gray-700">{selectedDetailsMentor.reason}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  handleViewCompatibilityReport(selectedDetailsMentor);
                  closeDetailsModal();
                }}
                className="px-3 py-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                View Compatibility Report
              </button>
              <button
                onClick={closeDetailsModal}
                className="px-3 py-1.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom scrollbar styles
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

const styleSheet = document.createElement("style");
styleSheet.textContent = customScrollbarStyles;
document.head.appendChild(styleSheet);

export default FindMentors;