import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Save, Loader2, User, Plus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { validateName, validateContact, validateDesignation, validateExperience } from '../../utils/validations';

interface Skill {
  name: string;
  proficiency: number;
}

interface MentorProfile {
  name: string;
  email: string;
  contact: string;
  experience: number;
  gender: string;
  designation: string;
  domain: string;
  skills: Skill[];
  profile_pic_url?: string;
}

interface ValidationErrors {
  name?: string;
  contact?: string;
  designation?: string;
  domain?: string;
  skills?: string;
  experience?: string;
}

interface SelectedSkill {
  name: string;
  proficiency: number;
}

const MentorProfile: React.FC = () => {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<MentorProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
  const [selectedNewSkills, setSelectedNewSkills] = useState<SelectedSkill[]>([]);

  const predefinedSkills = [
    "Python", "Java", "JavaScript", "C++", "SQL", "Node JS", "SpringBoot",
    "AWS", "GCP", "Docker", "Machine Learning", "Deep Learning", "NLP",
    "TensorFlow", "LangChain", "GenAI", "Data Analysis", "Big Data",
    "Data Structure", "Problem Solving", "Project Management", "Leadership",
    "Time Management", "Communication", "Public Speaking", "Critical Thinking",
    "Teamwork", "HTML", "CSS"
  ];

  const predefinedDomains = [
    "Artificial Intelligence & Machine Learning",
    "Database & Backend",
    "Cloud Computing",
    "DevOps & Deployment",
    "Data Science & Analytics",
    "Software Development",
    "Project & Team Management",
    "Soft Skills",
    "Web Development"
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      const authToken = accessToken.startsWith('Bearer') ? accessToken.split('Bearer ')[1] : accessToken;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/mentor/profile`, {
        headers: {
          'Token': authToken
        }
      });

      if (response.data) {
        const transformedData = {
          name: response.data.name || '',
          email: response.data.mail || '',
          contact: response.data.contact || '',
          experience: response.data.exp || 0,
          gender: response.data.gender || '',
          designation: response.data.designation || 'Not specified',
          domain: response.data.domain || 'Not specified',
          skills: response.data["Skill set"]?.map((skill: any) => ({
            name: skill.name || '',
            proficiency: skill.proficiency || 2
          })) || [],
          profile_pic_url: response.data.profile_pic_url
        };
        setProfile(transformedData);
        setTempProfile(transformedData);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        navigate('/auth/login');
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Validation functions
  const validateNameField = (name: string): string | undefined => {
    const result = validateName(name);
    return result.isValid ? undefined : result.error;
  };

  const validateContactField = (contact: string): string | undefined => {
    const result = validateContact(contact);
    return result.isValid ? undefined : result.error;
  };

  const validateDesignationField = (designation: string): string | undefined => {
    const result = validateDesignation(designation);
    return result.isValid ? undefined : result.error;
  };

  const validateExperienceField = (experience: number): string | undefined => {
    const result = validateExperience(experience);
    return result.isValid ? undefined : result.error;
  };

  const validateDomain = (domain: string): string | undefined => {
    if (!domain) return 'Domain is required';
    return undefined;
  };

  const validateSkills = (skills: Skill[]): string | undefined => {
    if (!skills.length) return 'At least one skill is required';
    if (skills.some(skill => !skill.name)) return 'All skills must have a name';
    if (skills.some(skill => skill.proficiency < 1 || skill.proficiency > 5)) return 'Skill proficiency must be between 1 and 5';
    return undefined;
  };

  const validateProfile = (): boolean => {
    if (!tempProfile) return false;
    
    const nameError = validateNameField(tempProfile.name);
    const contactError = validateContactField(tempProfile.contact);
    const designationError = validateDesignationField(tempProfile.designation);
    const domainError = validateDomain(tempProfile.domain);
    const skillsError = validateSkills(tempProfile.skills);
    const experienceError = validateExperienceField(tempProfile.experience);
    
    setValidationErrors({
      name: nameError,
      contact: contactError,
      designation: designationError,
      domain: domainError,
      skills: skillsError,
      experience: experienceError
    });

    return !nameError && !contactError && !designationError && !domainError && !skillsError && !experienceError;
  };

  // Handle field changes
  const handleChange = (field: keyof MentorProfile, value: string | number) => {
    if (!tempProfile) return;
    
    setTempProfile(prev => ({
      ...prev!,
      [field]: value
    }));

    // Validate the field immediately
    if (field === 'name') {
      const nameError = validateNameField(value as string);
      setValidationErrors(prev => ({
        ...prev,
        name: nameError
      }));
    } else if (field === 'contact') {
      const contactError = validateContactField(value as string);
      setValidationErrors(prev => ({
        ...prev,
        contact: contactError
      }));
    } else if (field === 'designation') {
      const designationError = validateDesignationField(value as string);
      setValidationErrors(prev => ({
        ...prev,
        designation: designationError
      }));
    } else if (field === 'experience') {
      const experienceError = validateExperienceField(value as number);
      setValidationErrors(prev => ({
        ...prev,
        experience: experienceError
      }));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddSkillsModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveChanges = async () => {
    if (!tempProfile || !validateProfile()) return;

    try {
      setSaving(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        setError('No access token found');
        return;
      }

      const authToken = accessToken.startsWith('Bearer') ? accessToken.split('Bearer ')[1] : accessToken;

      tempProfile.name = tempProfile.name.trim().replace(/\s+/g, ' ');
      tempProfile.designation = tempProfile.designation.trim().replace(/\s+/g, ' ');


      // Update profile
      const profileResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/mentor/profile_creation`,
        {
          name: tempProfile.name,
          contact: tempProfile.contact,
          designation: tempProfile.designation,
          exp: tempProfile.experience,
          domain_name: tempProfile.domain
        },
        {
          headers: {
            'Token': authToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (profileResponse.status === 200) {
        // Update skills
        const skillsToKeep = tempProfile.skills.filter(skill => skill.name);
        const skillsResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/mentor/skills`,
          {
            skills: skillsToKeep.map(skill => ({
              skill_name: skill.name,
              proficiency: skill.proficiency
            }))
          },
          {
            headers: { Token: accessToken }
          }
        );
        
        if (skillsResponse.status === 200) {
          // Fetch updated profile
          const updatedProfileResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/mentor/profile`,
            {
              headers: { Token: accessToken }
            }
          );
          
          if (updatedProfileResponse.status === 200) {
            const updatedProfile = {
              name: updatedProfileResponse.data.name || '',
              email: updatedProfileResponse.data.mail || '',
              contact: updatedProfileResponse.data.contact || '',
              experience: updatedProfileResponse.data.exp || 0,
              gender: updatedProfileResponse.data.gender || '',
              designation: updatedProfileResponse.data.designation || 'Not specified',
              domain: updatedProfileResponse.data.domain || 'Not specified',
              skills: updatedProfileResponse.data["Skill set"]?.map((skill: any) => ({
                name: skill.name || '',
                proficiency: skill.proficiency || 2
              })) || [],
              profile_pic_url: updatedProfileResponse.data.profile_pic_url
            };
            
            setProfile(updatedProfile);
            setTempProfile(updatedProfile);
            setEditMode(false);
            toast.success('Profile updated successfully');
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setTempProfile(profile);
    setEditMode(false);
    setValidationErrors({});
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

  const handleSkillChange = (index: number, field: 'name' | 'proficiency', value: string | number) => {
    if (!tempProfile) return;
    const newSkills = [...tempProfile.skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value
    };
    setTempProfile({
      ...tempProfile,
      skills: newSkills
    });
  };

  const handleAddNewSkills = () => {
    if (!tempProfile) return;
    setTempProfile({
      ...tempProfile,
      skills: [...tempProfile.skills, ...selectedNewSkills]
    });
    setSelectedNewSkills([]);
    setShowAddSkillsModal(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    if (!tempProfile) return;
    setTempProfile({
      ...tempProfile,
      skills: tempProfile.skills.filter(skill => skill.name !== skillName)
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-b from-blue-50 to-indigo-50">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
        <span className="mt-2 text-sm sm:text-base text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-blue-50 to-indigo-50">
        <p className="text-sm sm:text-base text-gray-600 mb-4">Failed to load profile data</p>
        <button 
          onClick={fetchProfile} 
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:bg-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[95vw] sm:max-w-4xl mx-auto p-4 sm:p-8 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Profile</h1>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:bg-blue-700 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center transition-all duration-200"
            >
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* View Mode */}
          {!editMode && (
            <>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-blue-200 hover:scale-[1.01] transition-all duration-300">
                {profile?.profile_pic_url ? (
                  <img
                    src={profile.profile_pic_url}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md hover:scale-105 transition-all duration-200"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{profile?.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600">{profile?.email}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Contact Information</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="w-full sm:w-24 text-sm sm:text-base text-gray-600 font-medium">Contact:</span>
                      <span className="text-sm sm:text-base text-gray-800">{profile?.contact || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="w-full sm:w-24 text-sm sm:text-base text-gray-600 font-medium">Designation:</span>
                      <span className="text-sm sm:text-base text-gray-800">{profile?.designation || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="w-full sm:w-24 text-sm sm:text-base text-gray-600 font-medium">Domain:</span>
                      <span className="text-sm sm:text-base text-gray-800">{profile?.domain || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="w-full sm:w-24 text-sm sm:text-base text-gray-600 font-medium">Experience:</span>
                      <span className="text-sm sm:text-base text-gray-800">{profile?.experience} years</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Skills</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {profile?.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm sm:text-base font-medium text-gray-800 truncate">{skill.name}</span>
                          <span className="text-xs sm:text-sm text-gray-500">{getProficiencyText(skill.proficiency)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.proficiency * 33.33}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Edit Mode Form */}
          {editMode && (
            <div className="space-y-6 sm:space-y-8">
              {/* Basic Information */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Basic Information</h3>
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tempProfile?.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full py-2 px-3 sm:py-3 sm:px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        validationErrors.name ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.name}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="w-full sm:w-24 text-sm sm:text-base text-gray-600 font-medium mb-1 sm:mb-0">Email:</span>
                    <span className="text-sm sm:text-base text-gray-800">{profile?.email}</span>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tempProfile?.designation || ''}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      className={`w-full py-2 px-3 sm:py-3 sm:px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        validationErrors.designation ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    />
                    {validationErrors.designation && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.designation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tempProfile?.contact || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleChange('contact', value);
                      }}
                      className={`w-full py-2 px-3 sm:py-3 sm:px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        validationErrors.contact ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    />
                    {validationErrors.contact && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.contact}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={tempProfile?.experience || 0}
                      onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                      className={`w-full py-2 px-3 sm:py-3 sm:px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                        validationErrors.experience ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    />
                    {validationErrors.experience && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.experience}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Domain */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Domain</h3>
                <select
                  className={`w-full py-2 px-3 sm:py-3 sm:px-4 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    validationErrors.domain ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                  }`}
                  value={tempProfile?.domain || ''}
                  onChange={(e) => handleChange('domain', e.target.value)}
                >
                  <option value="">Select a domain</option>
                  {predefinedDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                {validationErrors.domain && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">{validationErrors.domain}</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Skills</h3>
                <div className="space-y-4 sm:space-y-6">
                  {/* Selected Skills Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {tempProfile?.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm sm:text-base font-medium text-gray-800 truncate">{skill.name}</span>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <select
                              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                              value={skill.proficiency}
                              onChange={(e) => handleSkillChange(index, 'proficiency', parseInt(e.target.value))}
                            >
                              {[1, 2, 3].map((level) => (
                                <option key={level} value={level}>
                                  {getProficiencyText(level)}
                                </option>
                              ))}
                            </select>
                            {!profile?.skills.some(s => s.name === skill.name) && (
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

                  {/* Add Skills Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAddSkillsModal(true)}
                      className="cursor-pointer inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:shadow-md hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span>Add Skills</span>
                    </button>
                  </div>

                  {validationErrors.skills && (
                    <p className="text-xs sm:text-sm text-red-500 text-center">{validationErrors.skills}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={cancelEdit}
                  className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:bg-blue-700 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center disabled:opacity-50 transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Skills Modal */}
        {showAddSkillsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
            <div ref={dropdownRef} className="bg-white rounded-lg p-4 sm:p-6 max-w-[90vw] w-full max-h-[80vh] overflow-y-auto shadow-xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-t-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Add New Skills</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <div className="max-h-60 overflow-y-auto">
                  {predefinedSkills
                    .filter(skill => !tempProfile?.skills.some(s => s.name === skill))
                    .map((skill) => (
                      <div 
                        key={skill} 
                        className="flex items-center justify-between px-2 py-2 sm:px-3 sm:py-2 hover:bg-indigo-50 rounded-md transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="cursor-pointer mr-2 h-4 w-4 sm:h-5 sm:w-5"
                            checked={selectedNewSkills.some(s => s.name === skill)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNewSkills([...selectedNewSkills, { name: skill, proficiency: 2 }]);
                              } else {
                                setSelectedNewSkills(selectedNewSkills.filter(s => s.name !== skill));
                              }
                            }}
                          />
                          <span className="text-sm sm:text-base text-gray-700">{skill}</span>
                        </div>
                        {selectedNewSkills.some(s => s.name === skill) && (
                          <select
                            className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => {
                      setShowAddSkillsModal(false);
                      setSelectedNewSkills([]);
                    }}
                    className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewSkills}
                    disabled={selectedNewSkills.length === 0}
                    className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:bg-blue-700 hover:shadow-md hover:scale-105 disabled:opacity-50 transition-all duration-200"
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
  );
};

export default MentorProfile;