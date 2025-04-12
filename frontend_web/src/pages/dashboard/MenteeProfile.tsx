import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, X, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

// TypeScript interfaces
interface ProfileData {
  name: string;
  mail: string;
  contact: string;
  designation: string;
  "Skill set": Array<{
    name: string;
    isNew?: boolean; // Flag to track newly added skills
  }>;
  role: string;
}

interface ValidationErrors {
  name?: string;
  contact?: string;
  skills?: string;
}

// Predefined skills list
const PREDEFINED_SKILLS = [
  "Python",
  "Java",
  "JavaScript",
  "C++",
  "SQL",
  "Node JS",
  "SpringBoot",
  "AWS",
  "GCP",
  "Docker",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "TensorFlow",
  "LangChain",
  "GenAI",
  "Data Analysis",
  "Big Data",
  "Data Structure",
  "Problem Solving",
  "Project Management",
  "Leadership",
  "Time Management",
  "Communication",
  "Public Speaking",
  "Critical Thinking",
  "Teamwork",
  "HTML",
  "CSS"
];

const MenteeProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [editMode, setEditMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [availableSkills, setAvailableSkills] = useState<string[]>(PREDEFINED_SKILLS);

  // Profile states
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    mail: '',
    contact: '',
    designation: '',
    "Skill set": [],
    role: ''
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>({
    name: '',
    mail: '',
    contact: '',
    designation: '',
    "Skill set": [],
    role: ''
  });

  // Update available skills when tempProfile changes
  useEffect(() => {
    setAvailableSkills(PREDEFINED_SKILLS.filter(skill => 
      !tempProfile["Skill set"].some(s => s.name === skill)
    ));
  }, [tempProfile["Skill set"]]);

  // Add selected skill
  const addSkill = () => {
    if (selectedSkill) {
      // Check if skill with this name already exists
      const skillExists = tempProfile["Skill set"].some(skill => skill.name === selectedSkill);
      
      if (!skillExists) {
      setTempProfile(prev => ({
        ...prev,
          "Skill set": [...prev["Skill set"], { name: selectedSkill, isNew: true }]
      }));
      setSelectedSkill('');
      }
    }
  };

  // Remove skill
  const removeSkill = (skillNameToRemove: string) => {
    console.log(`Attempting to remove skill: ${skillNameToRemove}`);
    setTempProfile(prev => {
      // Create a new skills array without the skill to remove
      const updatedSkills = prev["Skill set"].filter(skill => skill.name !== skillNameToRemove);
      console.log(`Skills count before: ${prev["Skill set"].length}, after: ${updatedSkills.length}`);
      
      return {
      ...prev,
        "Skill set": updatedSkills
      };
    });
    
    // Update available skills
    setAvailableSkills(prev => {
      if (!prev.includes(skillNameToRemove)) {
        return [...prev, skillNameToRemove];
      }
      return prev;
    });
  };

  // Validation functions
  const validateContact = (contact: string): string => {
    if (!contact) return "Contact number is required";
    if (!/^\d{10}$/.test(contact)) return "Contact number must be 10 digits";
    return "";
  };

  const validateProfile = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Contact validation
    const contactError = validateContact(tempProfile.contact);
    if (contactError) {
      errors.contact = contactError;
      isValid = false;
    }

    // Skills validation
    if (tempProfile["Skill set"].length === 0) {
      errors.skills = "At least one skill is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Check for token first
      const token = localStorage.getItem('accessToken');
      console.log('Token available for profile fetch:', token ? `${token.substring(0, 10)}...` : 'No token found');
      
      if (!token) {
        console.error('No authentication token found in localStorage');
        setError('Authentication token missing. Please login again.');
        navigate('/auth/login');
        return;
      }
      
      // Format token properly - ensure it has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log('Using token with proper format:', authToken.substring(0, 15) + '...');
      
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      
      if (!email) {
        setError('User email not found. Please log in again.');
        navigate('/auth/login');
        return;
      }

      console.log("Fetching profile for user:", email);
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Try the mentee profile endpoint with proper token format
      try {
        console.log(`Calling API: GET ${apiBaseUrl}/mentee/mentee/profile`);
        console.log('Headers:', { 'Token': authToken.substring(0, 20) + '...' });
        
        const profileResponse = await axios.get(`${apiBaseUrl}/mentee/mentee/profile`, {
          headers: {
            'Token': authToken
          }
        });
        
        if (profileResponse.status === 200) {
          console.log("Profile data received from API:", profileResponse.data);
          
          // Check if skills are in the response
          let skills = [];
          if (profileResponse.data["Skill set"] && profileResponse.data["Skill set"].length > 0) {
            skills = profileResponse.data["Skill set"].map((skill: any) => ({
              name: skill.name,
              isNew: false // Mark existing skills from database
            }));
            console.log("Skills found in profile response:", skills);
          }
          
          const profileData: ProfileData = {
            name: profileResponse.data.name || '',
            mail: profileResponse.data.mail || email || '',
            contact: profileResponse.data.contact || '',
            designation: profileResponse.data.designation || '',
            "Skill set": skills,
            role: profileResponse.data.role || 'mentee'
          };
          
          setProfile(profileData);
          setTempProfile(profileData);
          
          // Store in localStorage for backup
          localStorage.setItem('name', profileData.name);
          localStorage.setItem('userContact', profileData.contact);
          localStorage.setItem('menteeSkills', JSON.stringify(profileData["Skill set"].map(s => s.name)));
          
          setLoading(false);
          return;
        }
      } catch (profileError) {
        console.error("Error fetching detailed profile:", profileError);
        // Continue to fallback approach
      }
      
      // Final fallback: Use data only from localStorage
      console.log("Using fallback profile data from localStorage");
      
      // Get skills from localStorage or use empty array
      const skillsString = localStorage.getItem('menteeSkills');
      let skills = [];
      try {
        if (skillsString) {
          skills = JSON.parse(skillsString);
        }
      } catch (e) {
        console.error("Error parsing skills from localStorage:", e);
      }
      
      const fallbackProfile: ProfileData = {
        name: name || 'User',
        mail: email || '',
        contact: localStorage.getItem('userContact') || '',
        designation: '',
        "Skill set": skills.length > 0 ? skills.map((skill: string) => ({ name: skill })) : [],
        role: 'mentee'
      };
      
      setProfile(fallbackProfile);
      setTempProfile(fallbackProfile);
      
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        navigate('/auth/login');
      } else if (error.message && error.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please check your connection.');
      } else {
        // Don't show detailed error to user
        setError('Unable to load profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Avatar animation
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFrame((prev) => (prev + 1) % 60);
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, []);

  // Handle field changes
  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when field is modified
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Save profile changes
  const saveChanges = async () => {
    setSaving(true);
    try {
      if (!validateProfile()) {
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/auth/login');
        return;
      }

      // Format token properly - ensure it has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Prepare the correct profile data format for the API
      const profileData = {
        name: tempProfile.name,
        contact: tempProfile.contact,
        designation: tempProfile.designation,
      };
      
      console.log('Updating mentee profile with data:', profileData);
      console.log('Using token:', authToken.substring(0, 15) + '...');
      console.log('API URL:', `${apiBaseUrl}/mentee/mentee/profile_creation`);
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Token': authToken.substring(0, 15) + '...'  
      });
      
      try {
        // First update the profile with PUT request
        const profileResponse = await axios.put(
          `${apiBaseUrl}/mentee/mentee/profile_creation`,
          profileData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': authToken
            }
          }
        );
        
        console.log('Profile update response:', profileResponse.data);
        
        // Then update skills with a separate POST request
        const skillsPayload = {
          skills: tempProfile["Skill set"].map(skill => ({
            skill_name: skill.name
          }))
        };

        console.log('Updating mentee skills with data:', skillsPayload);
        
        // First, get existing skills to avoid duplicates
        const existingSkillsResponse = await axios.get(
          `${apiBaseUrl}/mentee/mentee/profile`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': authToken
            }
          }
        );
        
        // Extract existing skill names
        const existingSkillNames = existingSkillsResponse.data["Skill set"]?.map((skill: any) => skill.name) || [];
        
        // Filter out skills that already exist
        const newSkills = tempProfile["Skill set"].filter(skill => !existingSkillNames.includes(skill.name));
        
        if (newSkills.length > 0) {
          const newSkillsPayload = {
            skills: newSkills.map(skill => ({
              skill_name: skill.name
            }))
          };
          
          console.log('Adding only new skills:', newSkillsPayload);
          
          const skillsResponse = await axios.post(
            `${apiBaseUrl}/mentee/mentee/skills`,
            newSkillsPayload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Token': authToken
              }
            }
          );
          
          console.log('Skills update response:', skillsResponse.data);
        } else {
          console.log('No new skills to add');
        }
        
        // Update localStorage for local data
        localStorage.setItem('name', tempProfile.name);
        localStorage.setItem('userContact', tempProfile.contact);
        localStorage.setItem('menteeSkills', JSON.stringify(tempProfile["Skill set"].map(s => s.name)));
        
        // Update the displayed profile
        setProfile(tempProfile);
        setEditMode(false);
        toast.success('Profile updated successfully!');
        
        // Refresh the profile data to ensure we have the latest data from the server
        fetchProfile();
      } catch (apiError: any) {
        console.error('API request failed:', apiError);
        console.error('Status:', apiError.response?.status);
        console.error('Response data:', apiError.response?.data);
        
        if (apiError.response?.status === 401) {
          toast.error('Authentication failed. Please log in again.');
          localStorage.removeItem('accessToken');
          navigate('/auth/login');
        } else {
          throw apiError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/auth/login');
      } else if (error.message && error.message.includes('Network Error')) {
        setError('Unable to connect to the server. Please check your connection.');
        toast.error('Network error. Please check your connection.');
      } else {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setTempProfile(profile);
    setEditMode(false);
    setError(null);
    setValidationErrors({});
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {profile.role === 'mentor' ? 'Mentor Profile' : 'Mentee Profile'}
        </h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Edit2 size={16} className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
          <div className="mt-2 pt-2 border-t border-red-300">
            <p className="text-sm">Troubleshooting steps:</p>
            <ol className="text-sm list-decimal ml-5 mt-1">
              <li>Check if your backend server is running at http://localhost:8000</li>
              <li>Try logging out and logging back in</li>
              <li>Make sure you have completed your profile</li>
              <li>Check console logs for detailed error information</li>
            </ol>
            <button 
              onClick={fetchProfile} 
              className="mt-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* View Mode */}
        {!editMode && (
          <>
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <FaUser className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{profile.name || 'Not specified'}</h2>
                <p className="text-gray-600">{profile.mail}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Contact:</span>
                    <span className="text-gray-800">{profile.contact || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Designation:</span>
                    <span className="text-gray-800">{profile.designation || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                {profile["Skill set"] && profile["Skill set"].length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile["Skill set"].map((skill) => (
                      <span key={skill.name} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No skills specified</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Edit Mode Form */}
        {editMode && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    value={tempProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Email:</span>
                  <span className="text-gray-800">{profile.mail}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.designation}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="Your occupation or student status"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.designation || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    placeholder="10-digit contact number"
                    maxLength={10}
                  />
                  {validationErrors.contact && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.contact}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {tempProfile["Skill set"] && tempProfile["Skill set"].length > 0 ? (
                  tempProfile["Skill set"].map((skill, index) => (
                    <span
                      key={`${skill.name}-${index}`}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <span className="flex items-center">
                        {skill.name}
                        {/* Empty span as requested by user */}
                        {!skill.isNew && (
                          <span className="ml-1 text-xs text-blue-600 italic"></span>
                        )}
                      </span>
                      {/* Only show delete button for newly added skills */}
                      {editMode && skill.isNew && (
                        <button
                          onClick={() => removeSkill(skill.name)}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No skills specified</p>
                )}
              </div>
              {editMode && (
                <div className="mt-4 flex gap-2">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="border rounded px-3 py-2"
                  >
                    <option value="">Select a skill</option>
                    {availableSkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Skill
                  </button>
                </div>
              )}
              {validationErrors.skills && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.skills}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {editMode && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MenteeProfile: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <MenteeProfileContent />
    </div>
  );
};

export default MenteeProfile;