import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { validateName, validateContact, validateDesignation } from '../../utils/validations';

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
  designation?: string;
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
        setValidationErrors(prev => ({ ...prev, skills: undefined }));
      } else {
        setValidationErrors(prev => ({ ...prev, skills: 'This skill is already added' }));
      }
    }
  };

  // Validation functions
  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate the field immediately
    let validationResult: { isValid: boolean; error?: string } = { isValid: true };
    switch (field) {
      case 'name':
        validationResult = validateName(value);
        setValidationErrors(prev => ({ ...prev, name: validationResult.error }));
        break;
      case 'contact':
        validationResult = validateContact(value);
        setValidationErrors(prev => ({ ...prev, contact: validationResult.error }));
        break;
      case 'designation':
        validationResult = validateDesignation(value);
        setValidationErrors(prev => ({ ...prev, designation: validationResult.error }));
        break;
    }
  };

  const handleBlur = (field: keyof ProfileData) => {
    const value = tempProfile[field];
    let validationResult: { isValid: boolean; error?: string } = { isValid: true };
    
    // Only validate string fields
    if (typeof value === 'string') {
      switch (field) {
        case 'name':
          validationResult = validateName(value);
          setValidationErrors(prev => ({ ...prev, name: validationResult.error }));
          break;
        case 'contact':
          validationResult = validateContact(value);
          setValidationErrors(prev => ({ ...prev, contact: validationResult.error }));
          break;
        case 'designation':
          validationResult = validateDesignation(value);
          setValidationErrors(prev => ({ ...prev, designation: validationResult.error }));
          break;
      }
    }
  };

  const validateProfile = (): boolean => {
    const nameValidation = validateName(tempProfile.name);
    const contactValidation = validateContact(tempProfile.contact);
    const designationValidation = validateDesignation(tempProfile.designation);
    
    setValidationErrors({
      name: nameValidation.error,
      contact: contactValidation.error,
      designation: designationValidation.error,
      skills: tempProfile["Skill set"].length === 0 ? "At least one skill is required" : undefined
    });
    
    return nameValidation.isValid && 
           contactValidation.isValid && 
           designationValidation.isValid && 
           tempProfile["Skill set"].length > 0;
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
      
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      
      // Try the mentee profile endpoint with proper token format
      try {
        console.log(`Calling API: GET ${apiBaseUrl}/mentee/mentee/profile`);
        console.log('Headers:', { 'Token': authToken.substring(0, 20) + '...' });
        
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/mentee/mentee/profile`, {
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

  // Save profile changes
  const saveChanges = async () => {
    setSaving(true);
    try {
      // Validate all fields before saving
      if (!validateProfile()) {
        toast.error('Please fill in all required fields correctly');
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/auth/login');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      const profileData = {
        name: tempProfile.name,
        contact: tempProfile.contact,
        designation: tempProfile.designation,
      };
      
      // First update the profile
      // const profileResponse = await axios.put(
      await axios.put(
        `${import.meta.env.VITE_API_URL}/mentee/mentee/profile_creation`,
        profileData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': authToken
          }
        }
      );
      
      // Then update only new skills
      if (tempProfile["Skill set"].length > 0) {
        try {
          // Filter only new skills (those with isNew flag)
          const newSkills = tempProfile["Skill set"].filter(skill => skill.isNew);
          
          if (newSkills.length > 0) {
            const skillsPayload = {
              skills: newSkills.map(skill => ({
                skill_name: skill.name
              }))
            };

            await axios.post(
              `${import.meta.env.VITE_API_URL}/mentee/mentee/skills`,
              skillsPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Token': authToken
                }
              }
            );
          }
        } catch (skillsError: any) {
          if (skillsError.response?.status === 409) {
            // Handle duplicate skill error gracefully
            toast.error('Some skills were already added. Please try adding different skills.');
            setSaving(false);
            return;
          }
          throw skillsError; // Re-throw other errors
        }
      }
      
      // Update localStorage
      localStorage.setItem('name', tempProfile.name);
      localStorage.setItem('userContact', tempProfile.contact);
      localStorage.setItem('menteeSkills', JSON.stringify(tempProfile["Skill set"].map(s => s.name)));
      
      // Update the displayed profile
      setProfile(tempProfile);
      setEditMode(false);
      toast.success('Profile updated successfully!');
      
      // Refresh the profile data
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/auth/login');
      } else if (error.message && error.message.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile';
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center cursor-pointer"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Your full name"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    onBlur={() => handleBlur('contact')}
                    placeholder="10-digit contact number"
                    maxLength={10}
                  />
                  {validationErrors.contact && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.contact}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.designation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    onBlur={() => handleBlur('designation')}
                    placeholder="Your designation"
                  />
                  {validationErrors.designation && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.designation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Skills <span className="text-red-500">*</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {tempProfile["Skill set"].map((skill, index) => (
                  <span
                    key={`${skill.name}-${index}`}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              {validationErrors.skills && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.skills}</p>
              )}
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {editMode && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 cursor-pointer"
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