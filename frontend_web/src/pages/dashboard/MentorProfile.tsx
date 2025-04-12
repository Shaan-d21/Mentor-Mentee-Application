import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Loader2, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface MentorProfile {
  name: string;
  email: string;
  contact: string;
  experience: number;
  gender: string;
  designation: string;
  domain: string;
  skills: Array<{
    name: string;
    proficiency: number;
  }>;
  profile_pic_url?: string;
}

const MentorProfile: React.FC = () => {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

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
        throw new Error('Unauthorized');
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiBaseUrl}/users/mentor/profile`, {
        headers: { Token: accessToken }
      });

      if (response.status === 200) {
        const transformedData = {
          name: response.data.name,
          email: response.data.mail,
          contact: response.data.contact,
          experience: response.data.exp,
          gender: response.data.gender,
          designation: response.data.designation,
          domain: response.data.domain,
          skills: response.data["Skill set"] || [],
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

  const handleChange = (field: keyof MentorProfile, value: string | number) => {
    if (!tempProfile) return;
    setTempProfile({
      ...tempProfile,
      [field]: value
    });
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

  const removeSkill = (index: number) => {
    if (!tempProfile) return;
    const newSkills = tempProfile.skills.filter((_, i) => i !== index);
    setTempProfile({
      ...tempProfile,
      skills: newSkills
    });
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!tempProfile?.contact) {
      errors.contact = 'Contact number is required';
    }
    if (!tempProfile?.designation) {
      errors.designation = 'Designation is required';
    }
    if (!tempProfile?.domain) {
      errors.domain = 'Domain is required';
    }
    if (tempProfile?.skills.some(skill => !skill.name)) {
      errors.skills = 'All skills must have a name';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveChanges = async () => {
    if (!tempProfile || !validateForm()) return;

    try {
      setSaving(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Unauthorized');
      }

      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Update profile with PUT request to the correct endpoint
      const profileResponse = await axios.put(
        `${apiBaseUrl}/users/mentor/profile_creation`,
        {
          name: tempProfile.name,
          contact: tempProfile.contact,
          designation: tempProfile.designation,
          exp: tempProfile.experience,
          domain_name: tempProfile.domain
        },
        {
          headers: { Token: accessToken }
        }
      );

      if (profileResponse.status === 200) {
        // Get current skills from the backend
        const currentSkillsResponse = await axios.get(
          `${apiBaseUrl}/users/mentor/profile`,
          {
            headers: { Token: accessToken }
          }
        );
        
        // Get the current skill names from the backend
        const currentSkillNames = currentSkillsResponse.data["Skill set"]?.map((skill: any) => skill.name) || [];
        
        // Get the new skill names from tempProfile
        const newSkillNames = tempProfile.skills.map(skill => skill.name);
        
        // Check if skills have changed
        const skillsChanged = 
          currentSkillNames.length !== newSkillNames.length || 
          currentSkillNames.some((name: string) => !newSkillNames.includes(name)) ||
          newSkillNames.some((name: string) => !currentSkillNames.includes(name));
        
        if (skillsChanged) {
          console.log('Skills have changed, updating...');
          
          // Create a new array with only the skills that should be kept
          const skillsToKeep = tempProfile.skills.filter(skill => skill.name);
          
          // Send the complete list of skills to the backend
          // This will replace all existing skills with this new list
          const skillsResponse = await axios.post(
            `${apiBaseUrl}/users/mentor/skills`,
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
          
          if (skillsResponse.status !== 200) {
            console.error('Failed to update skills:', skillsResponse.data);
            toast.error('Failed to update skills. Please try again.');
            return;
          }
          
          // Wait a moment to ensure the backend has processed the skills update
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Fetch the updated profile data from the server
        const updatedProfileResponse = await axios.get(
          `${apiBaseUrl}/users/mentor/profile`,
          {
            headers: { Token: accessToken }
          }
        );
        
        if (updatedProfileResponse.status === 200) {
          // Transform the data to match our profile structure
          const updatedProfile = {
            name: updatedProfileResponse.data.name,
            email: updatedProfileResponse.data.mail,
            contact: updatedProfileResponse.data.contact,
            experience: updatedProfileResponse.data.exp,
            gender: updatedProfileResponse.data.gender,
            designation: updatedProfileResponse.data.designation,
            domain: updatedProfileResponse.data.domain,
            skills: updatedProfileResponse.data["Skill set"] || [],
            profile_pic_url: updatedProfileResponse.data.profile_pic_url
          };
          
          // Update the UI state with the fresh data from the server
          setProfile(updatedProfile);
          setTempProfile(updatedProfile);
          setEditMode(false);
          toast.success('Profile updated successfully');
          
          // Log the updated skills for debugging
          console.log('Updated skills from server:', updatedProfileResponse.data["Skill set"]);
        } else {
          console.error('Failed to fetch updated profile:', updatedProfileResponse.data);
          toast.error('Profile updated, but failed to refresh data. Please reload the page.');
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

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load profile data</p>
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
              {profile.profile_pic_url ? (
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
                <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
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
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Domain:</span>
                    <span className="text-gray-800">{profile.domain || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-24 text-gray-600">Experience:</span>
                    <span className="text-gray-800">{profile.experience} years</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                {profile.skills && profile.skills.length > 0 ? (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    value={tempProfile?.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Email:</span>
                  <span className="text-gray-800">{profile.email}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.designation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile?.designation || ''}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    placeholder="Your designation"
                  />
                  {validationErrors.designation && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.designation}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.contact ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile?.contact || ''}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    placeholder="Your contact number"
                  />
                  {validationErrors.contact && (
                    <p className="text-sm text-red-500 mt-1">{validationErrors.contact}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={tempProfile?.experience || 0}
                    onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                    placeholder="Years of experience"
                  />
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
                    <div className="flex items-center justify-between gap-2">
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
                            className={isSkillSelected(skillName, index) ? 'text-gray-400' : ''}
                          >
                            {skillName}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
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