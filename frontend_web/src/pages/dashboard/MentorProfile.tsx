import React, { useState, useEffect } from 'react';
import { Edit2, Save, Loader2, User } from 'lucide-react';
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

const MentorProfile: React.FC = () => {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<MentorProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const addSkill = () => {
    if (!tempProfile) return;
    const availableSkills = getAvailableSkills();
    if (availableSkills.length > 0) {
      setTempProfile({
        ...tempProfile,
        skills: [...tempProfile.skills, { name: '', proficiency: 2 }]
      });
    }
  };

  const getAvailableSkills = () => {
    if (!tempProfile) return predefinedSkills;
    const selectedSkills = tempProfile.skills.map(skill => skill.name);
    return predefinedSkills.filter(skill => !selectedSkills.includes(skill));
  };

  const isSkillSelected = (skillName: string, currentSkillIndex: number) => {
    if (!tempProfile) return false;
    return tempProfile.skills.some((skill, index) => 
      skill.name === skillName && index !== currentSkillIndex
    );
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load profile data</p>
        <button 
          onClick={fetchProfile} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <Edit2 size={16} className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* View Mode */}
        {!editMode && (
          <>
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-8">
              {profile?.profile_pic_url ? (
                <img
                  src={profile.profile_pic_url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{profile?.name}</h2>
                <p className="text-gray-600">{profile?.email}</p>
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
                    <span className="text-gray-800">{profile?.contact || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Designation:</span>
                    <span className="text-gray-800">{profile?.designation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Domain:</span>
                    <span className="text-gray-800">{profile?.domain || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Experience:</span>
                    <span className="text-gray-800">{profile?.experience} years</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {profile.skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                            {getProficiencyText(skill.proficiency)}
                          </span>
                        </div>
                      </div>
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile?.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      validationErrors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Email:</span>
                  <span className="text-gray-800">{profile?.email}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile?.designation || ''}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      validationErrors.designation ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.designation && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.designation}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tempProfile?.contact || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleChange('contact', value);
                    }}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      validationErrors.contact ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.contact && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.contact}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={tempProfile?.experience || 0}
                    onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      validationErrors.experience ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors.experience && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Domain */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Domain</h3>
              <select
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.domain ? 'border-red-500' : 'border-gray-300'
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
                <p className="text-sm text-red-500 mt-1">{validationErrors.domain}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
              <div className="space-y-4">
                {tempProfile?.skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {skill.name && profile?.skills.some(s => s.name === skill.name) ? (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700">
                          {skill.name}
                        </div>
                      ) : (
                        <>
                          <select
                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              validationErrors.skills ? 'border-red-500' : 'border-gray-300'
                            }`}
                            value={skill.name}
                            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          >
                            <option value="">Select a skill</option>
                            {predefinedSkills.map((skillName) => (
                              <option 
                                key={skillName} 
                                value={skillName}
                                disabled={isSkillSelected(skillName, index)}
                              >
                                {skillName}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (!tempProfile) return;
                              const newSkills = [...tempProfile.skills];
                              newSkills.splice(index, 1);
                              setTempProfile({
                                ...tempProfile,
                                skills: newSkills
                              });
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Proficiency:</span>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleSkillChange(index, 'proficiency', level)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              skill.proficiency === level
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {getProficiencyText(level)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {getAvailableSkills().length > 0 && (
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add Skill
                  </button>
                )}
                {validationErrors.skills && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.skills}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8">
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

export default MentorProfile;