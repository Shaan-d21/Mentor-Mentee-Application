import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

interface MentorProfile {
  name: string;
  email: string;
  contact: string;
  githubId: string;
  experience: number;
  gender: string;
  skills: Array<{
    name: string;
    proficiency: number;
  }>;
  profile_pic_url?: string;
}

const MentorProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      const response = await axios.get('/api/v1/user/mentor/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status === 200) {
        // Transform the response data to match our interface
        const transformedData = {
          name: response.data.name,
          email: response.data.mail,
          contact: response.data.contact,
          githubId: response.data.github_id,
          experience: response.data.exp,
          gender: response.data.gender,
          skills: response.data.Skill_set || [],
          profile_pic_url: response.data.profile_pic_url
        };
        setProfile(transformedData);
        setTempProfile(transformedData);
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
    const errors: Record<string, string> = {};
    let isValid = true;

    if (tempProfile) {
      const contactError = validateContact(tempProfile.contact);
      if (contactError) {
        errors.contact = contactError;
        isValid = false;
      }

      const githubError = validateGithubId(tempProfile.githubId);
      if (githubError) {
        errors.githubId = githubError;
        isValid = false;
      }

      if (tempProfile.experience < 0) {
        errors.experience = "Experience cannot be negative";
        isValid = false;
      }

      if (tempProfile.skills.length === 0) {
        errors.skills = "At least one skill is required";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Handle field changes
  const handleChange = (field: keyof MentorProfile, value: any) => {
    if (tempProfile) {
      setTempProfile(prev => ({
        ...prev!,
        [field]: value
      }));

      // Clear validation error when field is modified
      if (validationErrors[field]) {
        setValidationErrors(prev => ({
          ...prev,
          [field]: ""
        }));
      }
    }
  };

  // Handle skill changes
  const handleSkillChange = (index: number, field: 'name' | 'proficiency', value: string | number) => {
    if (tempProfile) {
      const newSkills = [...tempProfile.skills];
      newSkills[index] = {
        ...newSkills[index],
        [field]: value
      };
      setTempProfile(prev => ({
        ...prev!,
        skills: newSkills
      }));
    }
  };

  // Add new skill
  const addSkill = () => {
    if (tempProfile) {
      setTempProfile(prev => ({
        ...prev!,
        skills: [...prev!.skills, { name: '', proficiency: 0 }]
      }));
    }
  };

  // Remove skill
  const removeSkill = (index: number) => {
    if (tempProfile) {
      setTempProfile(prev => ({
        ...prev!,
        skills: prev!.skills.filter((_, i) => i !== index)
      }));
    }
  };

  // Save profile changes
  const saveChanges = async () => {
    if (!validateProfile()) {
      toast.error("Please fill the required fields correctly");
      return;
    }

    try {
      setSaving(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Unauthorized");
      }

      // First, update the user profile
      const profilePayload = {
        name: tempProfile?.name,
        exp: tempProfile?.experience,
        github_id: tempProfile?.githubId,
        contact: tempProfile?.contact,
        gender: tempProfile?.gender?.toLowerCase()
      };

      const profileResponse = await axios.put(
        '/api/v1/user/mentor/profile_creation',
        profilePayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (profileResponse.status === 200) {
        // Then, update the skills
        const skillsPayload = {
          skills: tempProfile?.skills.map(skill => ({
            skill_name: skill.name,
            proficiency: skill.proficiency
          }))
        };

        const skillsResponse = await axios.post(
          '/api/v1/user/mentor/skills',
          skillsPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (skillsResponse.status === 200) {
          setProfile(tempProfile);
          setEditMode(false);
          toast.success("Profile updated successfully!");
          // Refresh profile data to get updated skills
          fetchProfile();
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        navigate("/auth/login");
      } else {
        toast.error(error.response?.data?.detail || "Failed to update profile");
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
      <div className="text-center text-red-500 p-4">
        Failed to load profile data
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
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
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <img
            src={profile.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          {editMode ? (
            <div className="space-y-2">
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded ${
                  validationErrors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                value={tempProfile?.contact || ''}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="Contact Number"
              />
              {validationErrors.contact && (
                <p className="text-sm text-red-500">{validationErrors.contact}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">{profile.contact}</p>
          )}
        </div>

        {/* GitHub ID */}
        <div>
          <h3 className="text-lg font-semibold mb-2">GitHub Profile</h3>
          {editMode ? (
            <div className="space-y-2">
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded ${
                  validationErrors.githubId ? 'border-red-500' : 'border-gray-300'
                }`}
                value={tempProfile?.githubId || ''}
                onChange={(e) => handleChange('githubId', e.target.value)}
                placeholder="GitHub Username"
              />
              {validationErrors.githubId && (
                <p className="text-sm text-red-500">{validationErrors.githubId}</p>
              )}
            </div>
          ) : (
            <a
              href={`https://github.com/${profile.githubId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {profile.githubId}
            </a>
          )}
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Experience</h3>
          {editMode ? (
            <div className="space-y-2">
              <input
                type="number"
                className={`w-full px-4 py-2 border rounded ${
                  validationErrors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
                value={tempProfile?.experience || 0}
                onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                placeholder="Years of Experience"
              />
              {validationErrors.experience && (
                <p className="text-sm text-red-500">{validationErrors.experience}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">{profile.experience} years</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Skills</h3>
          {editMode ? (
            <div className="space-y-4">
              {tempProfile?.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border rounded"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    placeholder="Skill Name"
                  />
                  <input
                    type="number"
                    className="w-24 px-4 py-2 border rounded"
                    value={skill.proficiency}
                    onChange={(e) => handleSkillChange(index, 'proficiency', parseInt(e.target.value))}
                    placeholder="Proficiency %"
                    min="0"
                    max="100"
                  />
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                onClick={addSkill}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Skill
              </button>
              {validationErrors.skills && (
                <p className="text-sm text-red-500">{validationErrors.skills}</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {editMode && (
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
        )}
      </div>
    </div>
  );
};

export default MentorProfileComponent; 