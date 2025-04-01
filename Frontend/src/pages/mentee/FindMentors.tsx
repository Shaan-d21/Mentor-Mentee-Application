import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the Mentor interface
interface Mentor {
  id: number;
  name: string;
  exp: number;
  github_id: string;
  profile_pic_url?: string;
  gender: string;
  skills: Array<{
    name: string;
    proficiency: number;
  }>;
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

const FindMentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const domainSelectRef = useRef<HTMLSelectElement>(null);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        const response = await axios.get('http://localhost:8000/api/v1/get-mentors', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        setMentors(response.data);
        setFilteredMentors(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch mentors');
        setLoading(false);
        console.error('Error fetching mentors:', err);
      }
    };

    fetchMentors();
  }, []);

  // Filter mentors based on search query, skill filter, and domain filter
  useEffect(() => {
    let filtered = [...mentors];
    
    // Filter by name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(query)
      );
    }
    
    // Filter by skill
    if (filterSkill) {
      filtered = filtered.filter(mentor => 
        mentor.skills.some(skill => 
          skill.name.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
    }
    
    // Filter by domain
    if (filterDomain) {
      // For now, we don't have domain information in the mentor objects
      // This would work if mentors had domain information
      // We'll keep this as a placeholder for future domain filtering logic
      console.log(`Filtering by domain: ${filterDomain}`);
    }
    
    setFilteredMentors(filtered);
  }, [searchQuery, filterSkill, filterDomain, mentors]);

  // Handler for requesting mentorship
  const handleRequestMentorship = async (mentorId: number) => {
    if (!selectedDomain) {
      toast.error('Please select a domain for mentorship');
      return;
    }

    try {
      setIsRequestPending(true);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      await axios.post(
        'http://localhost:8000/api/v1/mentee/mentorship',
        {
          mentor_id: mentorId,
          domain: selectedDomain
        },
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('Mentorship request sent successfully!');
      setSelectedMentor(null);
      setSelectedDomain('');
    } catch (err: any) {
      console.error('Error sending mentorship request:', err);
      toast.error(err.response?.data?.detail || 'Failed to send mentorship request');
    } finally {
      setIsRequestPending(false);
    }
  };

  // Handle domain filter change
  const handleDomainFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDomain(e.target.value);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Find Mentors</h1>
      
      {/* Search and filter container */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search mentors by name..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Skill filter */}
          <div className="md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter by skill..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
            />
            {filterSkill && (
              <button 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setFilterSkill('')}
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Domain filter */}
          <div className="md:w-1/3">
            <select
              ref={domainSelectRef}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDomain}
              onChange={handleDomainFilterChange}
            >
              <option value="">All Domains</option>
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Mentors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length > 0 ? (
          filteredMentors.map(mentor => (
            <div key={mentor.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                    {mentor.profile_pic_url ? (
                      <img 
                        src={mentor.profile_pic_url} 
                        alt={mentor.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {mentor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{mentor.name}</h3>
                    <p className="text-gray-600">Experience: {mentor.exp} years</p>
                    {mentor.github_id && (
                      <a 
                        href={`https://github.com/${mentor.github_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        GitHub Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.skills.map(skill => (
                    <span 
                      key={skill.name} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill.name} ({skill.proficiency}/3)
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => setSelectedMentor(mentor)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Request Mentorship
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8">
            <p className="text-gray-500 text-lg">No mentors found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Mentorship request modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Request Mentorship</h3>
              <p className="mb-4">
                You're requesting mentorship from <span className="font-semibold">{selectedMentor.name}</span>.
              </p>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Domain
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  required
                >
                  <option value="">Select a domain</option>
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedMentor(null);
                    setSelectedDomain('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isRequestPending}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRequestMentorship(selectedMentor.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isRequestPending || !selectedDomain}
                >
                  {isRequestPending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMentors; 