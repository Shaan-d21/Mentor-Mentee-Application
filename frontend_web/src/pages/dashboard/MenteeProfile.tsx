import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Loader2, Save, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { validateName, validateContact, validateDesignation } from '../../utils/validations';

interface ProfileData {
  name: string;
  mail: string;
  contact: string;
  designation: string;
  role: string;
  "Skill set": SelectedSkill[];
}

interface ValidationErrors {
  name?: string;
  contact?: string;
  designation?: string;
  skills?: string;
}

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

interface SelectedSkill {
  name: string;
  proficiency: number;
  skill_id?: number; // Added skill_id to track skill identifier
}

const MenteeProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [editMode, setEditMode] = useState(false);
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const [selectedNewSkills, setSelectedNewSkills] = useState<SelectedSkill[]>([]);

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

  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));

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

  const handleDeleteSkill = async (skillId: number, skillName: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token missing. Please login again.');
        navigate('/auth/login');
        return;
      }

      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/mentee/skill_delete`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': authToken
          },
          data: {
            skill_id: skillId
          }
        }
      );

      // Update tempProfile to remove the deleted skill
      setTempProfile(prev => ({
        ...prev,
        "Skill set": prev["Skill set"].filter(skill => skill.skill_id !== skillId)
      }));

      toast.success(`Skill "${skillName}" deleted successfully`);
    } catch (error: any) {
      console.error('Error deleting skill:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/auth/login');
      } else {
        toast.error('Failed to delete skill. Please try again.');
      }
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication token missing. Please login again.');
        navigate('/auth/login');
        return;
      }
      
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      
      if (!email) {
        setError('User email not found. Please log in again.');
        navigate('/auth/login');
        return;
      }

      try {
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/mentee/mentee/profile`, {
          headers: {
            'Token': authToken
          }
        });
        
        if (profileResponse.status === 200) {
          const skills = profileResponse.data["Skill set"]?.map((skill: any) => ({
            name: skill.name,
            proficiency: skill.proficiency || 2,
            skill_id: skill.skill_id, // Added skill_id
            isNew: false
          })) || [];
          
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
          
          localStorage.setItem('name', profileData.name);
          localStorage.setItem('userContact', profileData.contact);
          localStorage.setItem('menteeSkills', JSON.stringify(profileData["Skill set"].map(s => s.name)));
          
          setLoading(false);
          return;
        }
      } catch (profileError) {
        console.error("Error fetching detailed profile:", profileError);
      }
      
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
        "Skill set": skills.length > 0 ? skills.map((skill: string) => ({ name: skill, proficiency: 2 })) : [],
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
        setError('Unable to load profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveChanges = async () => {
    setSaving(true);
    try {
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
      
      tempProfile.name = tempProfile.name.trim().replace(/\s+/g, ' ');
      tempProfile.designation = tempProfile.designation.trim().replace(/\s+/g, ' ');

      const profileData = {
        name: tempProfile.name,
        contact: tempProfile.contact,
        designation: tempProfile.designation,
      };
      
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
      
      if (tempProfile["Skill set"].length > 0) {
        try {
          const skillsPayload = {
            skills: tempProfile["Skill set"].map(skill => ({
              skill_name: skill.name,
              proficiency: skill.proficiency
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
        } catch (skillsError: any) {
          if (skillsError.response?.status === 409) {
            toast.error('Some skills were already added. Please try adding different skills.');
            setSaving(false);
            return;
          }
          throw skillsError;
        }
      }
      
      localStorage.setItem('name', tempProfile.name);
      localStorage.setItem('userContact', tempProfile.contact);
      localStorage.setItem('menteeSkills', JSON.stringify(tempProfile["Skill set"].map(s => s.name)));
      
      setProfile(tempProfile);
      setEditMode(false);
      toast.success('Profile updated successfully!');
      
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

  const cancelEdit = () => {
    setTempProfile(profile);
    setEditMode(false);
    setError(null);
    setValidationErrors({});
  };

  const handleRemoveSkill = (skillName: string) => {
    setTempProfile({
      ...tempProfile,
      "Skill set": tempProfile["Skill set"].filter(skill => skill.name !== skillName)
    });
  };

  const handleAddNewSkills = () => {
    const newSkills = selectedNewSkills.map(skill => ({
      name: skill.name,
      proficiency: skill.proficiency,
      isNew: true
    }));
    setTempProfile({
      ...tempProfile,
      "Skill set": [...tempProfile["Skill set"], ...newSkills]
    });
    setSelectedNewSkills([]);
    setShowAddSkillsModal(false);
  };

  const handleSkillChange = (index: number, field: 'name' | 'proficiency', value: string | number) => {
    const newSkills = [...tempProfile["Skill set"]];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value
    };
    setTempProfile({
      ...tempProfile,
      "Skill set": newSkills
    });
  };

  const getProficiencyText = (level: number) => {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Intermediate';
      case 3:
        return 'Advanced';
      default:
        return 'Beginner';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-b from-blue-50 to-indigo-50">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              {profile.role === 'mentor' ? 'Mentor Profile' : 'Mentee Profile'}
            </h1>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center text-sm sm:text-base transition-all duration-200"
              >
                <Edit2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-500 text-red-700 p-3 sm:p-4 rounded-lg mb-6">
              <p className="text-sm sm:text-base">{error}</p>
              <div className="mt-2 pt-2 border-t border-red-300">
                <p className="text-xs sm:text-sm">Troubleshooting steps:</p>
                <ol className="text-xs sm:text-sm list-decimal ml-5 mt-1">
                  <li>Check if your backend server is running at http://localhost:8000</li>
                  <li>Try logging out and logging back in</li>
                  <li>Make sure you have completed your profile</li>
                  <li>Check console logs for detailed error information</li>
                </ol>
                <button 
                  onClick={fetchProfile} 
                  className="mt-2 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs sm:text-sm rounded"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {!editMode && (
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUser className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                      {profile.name || 'Not specified'}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 truncate">{profile.mail}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex items-center">
                        <span className="w-24 text-gray-600">Contact:</span>
                        <span className="text-gray-800 truncate">{profile.contact || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-gray-600">Designation:</span>
                        <span className="text-gray-800 truncate">{profile.designation || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Skills</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {profile["Skill set"].map((skill, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800 text-sm sm:text-base truncate">{skill.name}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{getProficiencyText(skill.proficiency)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {editMode && (
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                          validationErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={tempProfile.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        placeholder="Your full name"
                      />
                      {validationErrors.name && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                          validationErrors.contact ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={tempProfile.contact}
                        onChange={(e) => handleChange('contact', e.target.value)}
                        onBlur={() => handleBlur('contact')}
                        placeholder="10-digit contact number"
                        maxLength={10}
                      />
                      {validationErrors.contact && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.contact}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                          validationErrors.designation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={tempProfile.designation}
                        onChange={(e) => handleChange('designation', e.target.value)}
                        onBlur={() => handleBlur('designation')}
                        placeholder="Your designation"
                      />
                      {validationErrors.designation && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.designation}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Skills <span className="text-red-500">*</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {tempProfile["Skill set"].map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 text-sm sm:text-base truncate">{skill.name}</span>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <select
                              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                              value={skill.proficiency}
                              onChange={(e) => handleSkillChange(index, 'proficiency', parseInt(e.target.value))}
                            >
                              {[1, 2, 3].map((level) => (
                                <option key={level} value={level}>
                                  {getProficiencyText(level)}
                                </option>
                              ))}
                            </select>
                            {skill.skill_id ? (
                              <button
                                onClick={() => skill.skill_id && handleDeleteSkill(skill.skill_id, skill.name)}
                                className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRemoveSkill(skill.name)}
                                className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <button
                      onClick={() => setShowAddSkillsModal(true)}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 hover:shadow-md hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Add Skills
                    </button>
                  </div>

                  {validationErrors.skills && (
                    <p className="text-xs sm:text-sm text-red-500 mt-2 text-center">{validationErrors.skills}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {editMode && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={cancelEdit}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:scale-105 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 transition-all duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {showAddSkillsModal && (
            <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Add New Skills</h3>
                <div className="space-y-4">
                  <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                    {PREDEFINED_SKILLS
                      .filter(skill => !tempProfile["Skill set"].some(s => s.name === skill))
                      .map((skill) => (
                        <div key={skill} className="flex items-center justify-between px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-2 h-4 w-4 sm:h-5 sm:w-5"
                              checked={selectedNewSkills.some(s => s.name === skill)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedNewSkills([...selectedNewSkills, { name: skill, proficiency: 2 }]);
                                } else {
                                  setSelectedNewSkills(selectedNewSkills.filter(s => s.name !== skill));
                                }
                              }}
                            />
                            <span className="text-sm sm:text-base">{skill}</span>
                          </div>
                          {selectedNewSkills.some(s => s.name === skill) && (
                            <select
                              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={selectedNewSkills.find(s => s.name === skill)?.proficiency || 2}
                              onChange={(e) => {
                                setSelectedNewSkills(selectedNewSkills.map(s => 
                                  s.name === skill ? { ...s, proficiency: parseInt(e.target.value) } : s
                                ));
                              }}
                            >
                              {[1, 2, 3].map((level) => (
                                <option key={level} value={level}>
                                  {getProficiencyText(level)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddSkillsModal(false);
                        setSelectedNewSkills([]);
                      }}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewSkills}
                      disabled={selectedNewSkills.length === 0}
                      className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105 disabled:opacity-50 transition-all duration-200"
                    >
                      Add Selected Skills
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MenteeProfile: React.FC = () => {
  return (
    <MenteeProfileContent />
  );
};

export default MenteeProfile;