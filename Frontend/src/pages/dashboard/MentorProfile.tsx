import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '~/config/api';
import { FaUser } from 'react-icons/fa';

// TypeScript interfaces
interface SkillWithProficiency {
  name: string;
  proficiency: number;
}

interface ProfileData {
  name: string;
  email: string;
  contact: string;
  gender: string;
  github_id: string;
  exp: number;
  skills: SkillWithProficiency[];
  role: string;
}

interface ValidationErrors {
  contact?: string;
  gender?: string;
  skills?: string;
  github_id?: string;
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

const MentorProfile: React.FC = () => {
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
    email: '',
    contact: '',
    gender: '',
    github_id: '',
    exp: 0,
    skills: [],
    role: ''
  });

  const [tempProfile, setTempProfile] = useState<ProfileData>({
    name: '',
    email: '',
    contact: '',
    gender: '',
    github_id: '',
    exp: 0,
    skills: [],
    role: ''
  });

  // Update available skills when tempProfile changes
  useEffect(() => {
    const currentSkillNames = tempProfile.skills.map(skill => skill.name);
    setAvailableSkills(PREDEFINED_SKILLS.filter(skill => !currentSkillNames.includes(skill)));
  }, [tempProfile.skills]);

  // Add selected skill
  const addSkill = () => {
    if (selectedSkill && !tempProfile.skills.some(skill => skill.name === selectedSkill)) {
      setTempProfile(prev => ({
        ...prev,
        skills: [...prev.skills, { name: selectedSkill, proficiency: 50 }]
      }));
      setSelectedSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillNameToRemove: string) => {
    setTempProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillNameToRemove)
    }));
  };

  // Handle skill proficiency change
  const handleSkillProficiencyChange = (skillName: string, newProficiency: number) => {
    setTempProfile(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.name === skillName 
          ? { ...skill, proficiency: newProficiency }
          : skill
      )
    }));
  };

  // Validation functions
  const validateContact = (contact: string): string => {
    if (!contact) return "Contact number is required";
    if (!/^\d{10}$/.test(contact)) return "Contact number must be 10 digits";
    if (!/^[6-9]/.test(contact)) return "Contact number must start with 6-9";
    return "";
  };

  const validateGithubId = (githubId: string): string => {
    if (githubId && !/^[a-zA-Z0-9-]+$/.test(githubId)) {
      return "GitHub ID can only contain letters, numbers, and hyphens";
    }
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

    // Gender validation
    if (!tempProfile.gender) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    // Skills validation
    if (tempProfile.skills.length === 0) {
      errors.skills = "At least one skill is required";
      isValid = false;
    }

    // GitHub ID validation
    if (tempProfile.github_id) {
      const githubError = validateGithubId(tempProfile.github_id);
      if (githubError) {
        errors.github_id = githubError;
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const userInfoString = localStorage.getItem("userInfo");

      if (!accessToken || !userInfoString) {
        throw new Error("Unauthorized");
      }

      const response = await api.get('/api/v1/user/mentor/profile');

      if (response.status === 200) {
        const userData = response.data;
        const profileData: ProfileData = {
          name: userData.name || "",
          email: userData.mail || "",
          contact: userData.contact || "",
          gender: userData.gender || "",
          github_id: userData.github_id || "",
          exp: userData.exp || 0,
          skills: userData['Skill set']?.map((skill: { name: string; proficiency: number }) => ({
            name: skill.name,
            proficiency: skill.proficiency || 50
          })) || [],
          role: userData.role || "mentor"
        };

        setProfile(profileData);
        setTempProfile(profileData);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        navigate("/auth/login");
      } else {
        setError("Failed to load profile data");
      }
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
      // Validate profile before saving
      if (!validateProfile()) {
        return;
      }

      setSaving(true);

      // Update profile
      const profilePayload = {
        name: tempProfile.name,
        exp: tempProfile.exp || 0,
        github_id: tempProfile.github_id,
        contact: tempProfile.contact,
        gender: tempProfile.gender.toLowerCase(),
        mail: tempProfile.email
      };

      const profileResponse = await api.put('/api/v1/user/mentor/profile_creation', profilePayload);
      
      if (profileResponse.status === 200) {
        // Update skills
        const skillsPayload = {
          skills: tempProfile.skills.map(skill => ({
            skill_name: skill.name,
            proficiency: skill.proficiency
          }))
        };

        const skillsResponse = await api.post('/api/v1/user/mentor/skills', skillsPayload);
        
        if (skillsResponse.status === 200) {
          // Update localStorage to indicate profile is completed
          const userInfoString = localStorage.getItem("userInfo");
          if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            userInfo.profileCompleted = true;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
          
          setProfile(tempProfile);
          setEditMode(false);
          toast.success('Profile updated successfully!');
          // Refresh profile data
          fetchProfile();
        } else {
          throw new Error('Failed to update skills');
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to update profile. Please try again.');
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
                    <span className="w-24 text-gray-600">Gender:</span>
                    <span className="text-gray-800">{profile.gender || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* GitHub Profile */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">GitHub Profile</h3>
                {profile.github_id ? (
                  <a
                    href={`https://github.com/${profile.github_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    {profile.github_id}
                  </a>
                ) : (
                  <p className="text-gray-600">GitHub profile not linked</p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                {profile.skills?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {profile.skills.map((skill) => (
                      <div key={skill.name} className="bg-white p-3 rounded shadow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-blue-800">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
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
            {/* Read-only Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Name:</span>
                  <span className="text-gray-800">{profile.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-24 text-gray-600">Email:</span>
                  <span className="text-gray-800">{profile.email}</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={tempProfile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.gender && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            {/* GitHub ID */}
            <div>
              <h3 className="text-lg font-semibold mb-3">GitHub Profile</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Username</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.github_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={tempProfile.github_id}
                  onChange={(e) => handleChange('github_id', e.target.value)}
                  placeholder="GitHub username"
                />
                {validationErrors.github_id && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.github_id}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="space-y-3">
                {tempProfile.skills.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Skills</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {tempProfile.skills.map((skill) => (
                        <div key={skill.name} className="bg-white p-4 rounded shadow">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{skill.name}</span>
                            <button 
                              onClick={() => removeSkill(skill.name)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.proficiency}
                            onChange={(e) => handleSkillProficiencyChange(skill.name, parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>0%</span>
                            <span>{skill.proficiency}%</span>
                            <span>100%</span>
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
                
                {availableSkills.length === 0 && tempProfile.skills.length === PREDEFINED_SKILLS.length && (
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

export default MentorProfile;