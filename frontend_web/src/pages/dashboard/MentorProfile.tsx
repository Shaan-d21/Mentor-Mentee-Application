import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FaUser } from 'react-icons/fa';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import axios from 'axios';

// TypeScript interfaces
interface SkillWithProficiency {
  name: string;
  proficiency: number;
  isNew?: boolean; // Flag to track newly added skills
}

interface ProfileData {
  name: string;
  mail: string;
  contact: string;
  designation: string;
  exp: number;
  "Skill set": Array<SkillWithProficiency>;
  role: string;
}

interface ValidationErrors {
  contact?: string;
  designation?: string;
  skills?: string;
}

// Predefined skills list
const PREDEFINED_SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "SQL",
  "Machine Learning",
  "Data Science",
  "Cybersecurity"
];

// Add this constant for proficiency levels
const PROFICIENCY_LEVELS = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Expert' }
];

const MentorProfileContent: React.FC = () => {
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
    exp: 0,
    "Skill set": [],
    role: ''
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>({
    name: '',
    mail: '',
    contact: '',
    designation: '',
    exp: 0,
    "Skill set": [],
    role: ''
  });

  // Update available skills when tempProfile changes
  useEffect(() => {
    const currentSkillNames = tempProfile["Skill set"].map(skill => skill.name);
    setAvailableSkills(PREDEFINED_SKILLS.filter(skill => !currentSkillNames.includes(skill)));
  }, [tempProfile["Skill set"]]);

  // Add skill
  const addSkill = () => {
    if (selectedSkill) {
      // Check if skill with this name already exists
      const skillExists = tempProfile["Skill set"].some(skill => skill.name === selectedSkill);
      
      if (!skillExists) {
        setTempProfile(prev => ({
          ...prev,
          "Skill set": [...prev["Skill set"], { name: selectedSkill, proficiency: 3, isNew: true }]
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
    if (!/^[6-9]/.test(contact)) return "Contact number must start with 6-9";
    return "";
  };

  const validateDesignation = (designation: string): string => {
    if (!designation) return "Designation is required";
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

    // Designation validation
    const designationError = validateDesignation(tempProfile.designation);
    if (designationError) {
      errors.designation = designationError;
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
      // Get user data from localStorage
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        navigate('/auth/login');
        return;
      }
      
      console.log('Fetching mentor profile with token:', token.substring(0, 15) + '...');
      
      // Get API base URL
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Initialize profile with data from localStorage
      const initialProfile: ProfileData = {
        name: name || '',
        mail: email || '',
        contact: '',
        designation: '',
        exp: 0,
        "Skill set": [],
        role: 'mentor'
      };
      
      // Format token properly - ensure it has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      try {
        // 1. First try to get user data from mentor profile endpoint
        try {
          console.log('Fetching mentor profile data...');
          const profileResponse = await axios.get(`${apiBaseUrl}/users/mentor/profile`, {
            headers: {
              Authorization: authToken
            }
          });
          
          if (profileResponse.status === 200) {
            console.log('Mentor profile data received:', profileResponse.data);
            // Update initial profile with data from backend
            initialProfile.name = profileResponse.data.name || name || '';
            initialProfile.mail = profileResponse.data.mail || email || '';
            initialProfile.contact = profileResponse.data.contact || '';
            initialProfile.designation = profileResponse.data.designation || '';
            initialProfile.exp = profileResponse.data.exp || 0;
            initialProfile.role = 'mentor';
            
            // If skill set is included in profile response, use it
            if (profileResponse.data["Skill set"] && profileResponse.data["Skill set"].length > 0) {
              console.log('Skills found in profile response:', profileResponse.data["Skill set"]);
              initialProfile["Skill set"] = profileResponse.data["Skill set"].map((skill: any) => ({
                name: skill.name,
                proficiency: skill.proficiency || 2,
                isNew: false // Mark existing skills from database
              }));
            }
          }
        } catch (profileError) {
          console.error('Error fetching mentor profile:', profileError);
          // Fallback to all_users endpoint
        }
        
        // 2. Skip the get-skills endpoint since it returns 404
        // The skills should already be included in the profile response above
        
        console.log('Setting profile data:', initialProfile);
        setProfile(initialProfile);
        setTempProfile(initialProfile);
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
        // Still set the profile with localStorage data as fallback
        setProfile(initialProfile);
        setTempProfile(initialProfile);
        toast.error('Could not load complete profile data from server. Using local data instead.');
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError('Failed to load profile data. Please try logging out and back in.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    try {
      setSaving(true);
      if (!validateProfile()) {
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing. Please login again.');
        navigate('/auth/login');
        return;
      }
      
      // Get API base URL
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // Format token properly - ensure it has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Update profile info
      try {
        console.log("Updating mentor profile with data:", {
          name: tempProfile.name,
          designation: tempProfile.designation,
          exp: tempProfile.exp,
          contact: tempProfile.contact,
        });
        
        // Step 1: Update profile information
        const response = await axios.put(`${apiBaseUrl}/users/mentor/profile_creation`, {
          name: tempProfile.name,
          designation: tempProfile.designation,
          exp: tempProfile.exp,
          contact: tempProfile.contact,
        }, {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          console.log("Profile updated successfully on API");
          
          // Step 2: Only send NEW skills to the backend to avoid duplicate key error
          try {
            // Filter out only the newly added skills (those with isNew=true)
            const newSkills = tempProfile["Skill set"].filter(skill => skill.isNew);
            
            if (newSkills.length > 0) {
              const skillsPayload = {
                skills: newSkills.map(skill => ({
                  skill_name: skill.name,
                  proficiency: skill.proficiency
                }))
              };
              
              console.log("Sending only NEW skills to backend:", skillsPayload);
              
              const skillsResponse = await axios.post(
                `${apiBaseUrl}/users/mentor/skills`, 
                skillsPayload,
                {
                  headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (skillsResponse.status === 200) {
                console.log("New skills added successfully");
              }
            } else {
              console.log("No new skills to add");
            }
            
            // Mark all skills as not new after saving successfully
            const updatedProfile = {
              ...tempProfile,
              "Skill set": tempProfile["Skill set"].map(skill => ({
                ...skill,
                isNew: false // After saving, no skills are "new" anymore
              }))
            };
            
            // Update UI
            setProfile(updatedProfile);
            setTempProfile(updatedProfile);
            setEditMode(false);
            toast.success('Profile updated successfully');
            
            // Update localStorage
            localStorage.setItem('name', tempProfile.name);
            
          } catch (skillError: any) {
            console.error("Failed to add new skills:", skillError);
            console.error("Status:", skillError.response?.status);
            console.error("Response data:", skillError.response?.data);
            toast.error("Profile updated but skills couldn't be saved. Please try again.");
            
            // Still update basic profile without skills
            setEditMode(false);
          }
        }
      } catch (apiError: any) {
        console.error("API save failed:", apiError);
        console.error("Status:", apiError.response?.status);
        console.error("Response data:", apiError.response?.data);
        toast.error('Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to update profile');
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
        <h1 className="text-2xl font-bold text-gray-800">Mentor Profile</h1>
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
          {error}
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
                <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
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
                {profile["Skill set"]?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile["Skill set"].map((skill) => {
                      const proficiencyLevel = PROFICIENCY_LEVELS.find(level => level.value === skill.proficiency) || PROFICIENCY_LEVELS[1];
                      return (
                        <span key={skill.name} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill.name} ({proficiencyLevel.label})
                        </span>
                      );
                    })}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.designation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    placeholder="Designation"
                  />
                  {validationErrors.designation && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.designation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="space-y-3">
                {tempProfile["Skill set"].length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Skills</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {tempProfile["Skill set"].map((skill) => (
                        <div key={skill.name} className="bg-white p-4 rounded shadow">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-grow">
                              <div className="flex items-center">
                                <span className="font-medium block">{skill.name}</span>
                                {/* Empty span as requested by user */}
                                {!skill.isNew && (
                                  <span className="ml-2 text-xs text-gray-500 italic"></span>
                                )}
                              </div>
                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                                {skill.isNew ? (
                                  <select 
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    value={skill.proficiency}
                                    onChange={(e) => {
                                      const newProficiency = parseInt(e.target.value);
                                      setTempProfile(prev => ({
                                        ...prev,
                                        "Skill set": prev["Skill set"].map(s => 
                                          s.name === skill.name 
                                            ? { ...s, proficiency: newProficiency }
                                            : s
                                        )
                                      }));
                                    }}
                                  >
                                    {PROFICIENCY_LEVELS.map((level) => (
                                      <option key={level.value} value={level.value}>
                                        {level.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <div className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700">
                                    {PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label || 'Intermediate'}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Only allow deleting new skills */}
                            {skill.isNew && (
                              <button 
                                onClick={() => removeSkill(skill.name)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="Remove skill"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex">
                  <select
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    disabled={availableSkills.length === 0}
                  >
                    <option value="">Select a skill to add</option>
                    {availableSkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addSkill}
                    disabled={!selectedSkill}
                    className={`px-4 py-2 rounded-r ${
                      selectedSkill
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add Skill
                  </button>
                </div>
                
                {availableSkills.length === 0 && tempProfile["Skill set"].length === PREDEFINED_SKILLS.length && (
                  <p className="mt-1 text-sm text-gray-500">All available skills have been added.</p>
                )}

                {validationErrors.skills && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.skills}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
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
          </div>
        )}
      </div>
    </div>
  );
};

const MentorProfile: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <MentorProfileContent />
    </div>
  );
};

export default MentorProfile;