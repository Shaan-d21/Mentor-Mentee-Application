import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';

// Profile data
interface ProfileData {
  name: string;
  mail: string;
  role: string;
  github_id: string;
  contact: string;
  gender: string;
  'Skill set': string[];
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

const MenteeProfile: React.FC = () => {
  // State for profile data
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    mail: '',
    role: '',
    github_id: '',
    contact: '',
    gender: '',
    'Skill set': []
  });

  // Edit mode state
  const [editMode, setEditMode] = useState<boolean>(false);
  // Temporary state for edits
  const [tempProfile, setTempProfile] = useState<ProfileData>({
    name: '',
    mail: '',
    role: '',
    github_id: '',
    contact: '',
    gender: '',
    'Skill set': []
  });
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Contact validation error
  const [contactError, setContactError] = useState<string | null>(null);
  // Animation frame for subtle avatar animation
  const [frame, setFrame] = useState<number>(0);
  // Available skills (ones that haven't been selected)
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  // Currently selected skill in dropdown
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/mentee/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfile(data);
        setTempProfile(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update available skills whenever edit mode is toggled or tempProfile skills change
  useEffect(() => {
    if (editMode) {
      setAvailableSkills(
        PREDEFINED_SKILLS.filter(skill => !tempProfile['Skill set'].includes(skill))
      );
      setSelectedSkill('');
    }
  }, [editMode, tempProfile['Skill set']]);

  // Subtle animation for the avatar
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % 60);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle field changes
  const handleChange = (field: keyof ProfileData, value: string) => {
    if (field === 'contact') {
      if (!/^\d*$/.test(value)) {
        setContactError('Contact number must contain only digits');
        return;
      } else if (value.length > 10) {
        setContactError('Contact number must be 10 digits');
        return;
      } else {
        setContactError(null);
      }
    }

    setTempProfile({
      ...tempProfile,
      [field]: value
    });
  };

  // Add selected skill
  const addSkill = () => {
    if (selectedSkill && !tempProfile['Skill set'].includes(selectedSkill)) {
      setTempProfile({
        ...tempProfile,
        'Skill set': [...tempProfile['Skill set'], selectedSkill]
      });
      setSelectedSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove: string) => {
    setTempProfile({
      ...tempProfile,
      'Skill set': tempProfile['Skill set'].filter(skill => skill !== skillToRemove)
    });
  };

  // Save profile changes
  const saveChanges = async () => {
    try {
      // Check mandatory fields
      if (!tempProfile.name || !tempProfile.mail || !tempProfile.contact || 
          !tempProfile.gender || tempProfile['Skill set'].length === 0) {
        setError('Please fill all mandatory fields');
        return;
      }

      // Contact validation
      if (tempProfile.contact.length !== 10) {
        setContactError('Contact number must be exactly 10 digits');
        setError('Please correct the errors before saving');
        return;
      }

      // Update skills
      const skillsResponse = await fetch('/mentee/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: tempProfile['Skill set']
        }),
      });

      if (!skillsResponse.ok) {
        throw new Error('Failed to update skills');
      }

      // Update other profile details
      const profileResponse = await fetch('/mentee/profile_creation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tempProfile.name,
          mail: tempProfile.mail,
          role: tempProfile.role,
          github_id: tempProfile.github_id,
          contact: tempProfile.contact,
          gender: tempProfile.gender
        }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      setProfile(tempProfile);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setTempProfile(profile);
    setEditMode(false);
    setError(null);
    setContactError(null);
  };

  // ProfileAvatar component with image URLs
  const ProfileAvatar = ({ imageUrl = null, gender = '', scale = 1 }) => {
    // If specific image URL is provided
    if (imageUrl) {
      return (
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      );
    }
    
    // Gender-based image URLs
    let avatarUrl;
    
    if (gender === 'Female') {
      avatarUrl = "https://cdn-icons-png.flaticon.com/512/146/146005.png"; 
    } else if (gender === 'Male') {
      avatarUrl = "https://cdn-icons-png.flaticon.com/512/146/146007.png"; 
    } else {
      avatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
    }
    
    return (
      <div className="w-32 h-32 mx-auto mb-6 relative">
        <img 
          src={avatarUrl} 
          alt={`${gender || 'User'} Profile`}
          className="w-full h-full rounded-full object-cover"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    );
  };
  
  // UserAvatar component as before
  const UserAvatar = () => {
    const scale = 1 + Math.sin(frame / 10) * 0.01;
    return <ProfileAvatar imageUrl={null} gender={profile.gender} scale={scale} />;
  };

  // Mandatory field asterisk
const RequiredAsterisk = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Mentee Profile</h1>
      
      <UserAvatar />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Name - non-editable */}
        <div className="grid grid-cols-3 items-center">
          <label className="font-medium text-gray-700">Name<RequiredAsterisk /></label>
          <div className="col-span-2 px-4 py-2 bg-gray-50 rounded border border-gray-200 text-gray-700">
            {profile.name}
          </div>
        </div>
        
        {/* Email - non-editable */}
        <div className="grid grid-cols-3 items-center">
          <label className="font-medium text-gray-700">Email<RequiredAsterisk /></label>
          <div className="col-span-2 px-4 py-2 bg-gray-50 rounded border border-gray-200 text-gray-700">
            {profile.mail}
          </div>
        </div>
        
        {/* Contact - editable */}
        <div className="grid grid-cols-3 items-center">
          <label className="font-medium text-gray-700">Contact<RequiredAsterisk /></label>
          {editMode ? (
            <div className="col-span-2">
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  contactError ? 'border-red-500' : 'border-gray-300'
                }`}
                value={tempProfile.contact || ''}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="10-digit contact number"
                maxLength={10}
              />
              {contactError && (
                <p className="mt-1 text-sm text-red-500">{contactError}</p>
              )}
            </div>
          ) : (
            <div className="col-span-2 px-4 py-2 border rounded text-gray-700">
              {profile.contact || 'Not specified'}
            </div>
          )}
        </div>
        
        {/* Gender - editable */}
        <div className="grid grid-cols-3 items-center">
          <label className="font-medium text-gray-700">Gender<RequiredAsterisk /></label>
          {editMode ? (
            <select
              className="col-span-2 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tempProfile.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          ) : (
            <div className="col-span-2 px-4 py-2 border rounded text-gray-700">
              {profile.gender || 'Not specified'}
            </div>
          )}
        </div>
        
        {/* GitHub ID - editable, optional */}
        <div className="grid grid-cols-3 items-center">
          <label className="font-medium text-gray-700">GitHub ID</label>
          {editMode ? (
            <input
              type="text"
              className="col-span-2 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tempProfile.github_id || ''}
              onChange={(e) => handleChange('github_id', e.target.value)}
              placeholder="GitHub username"
            />
          ) : (
            <div className="col-span-2 px-4 py-2 border rounded flex items-center text-gray-700">
              {profile.github_id ? (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
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
                </>
              ) : (
                'Not specified'
              )}
            </div>
          )}
        </div>
        
        {/* Skills - editable */}
        <div className="grid grid-cols-3 items-start">
          <label className="font-medium text-gray-700 pt-2">Skills<RequiredAsterisk /></label>
          <div className="col-span-2">
            {editMode ? (
              <div className="space-y-3">
                {tempProfile['Skill set'].length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tempProfile['Skill set'].map((skill) => (
                      <div key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center">
                        <span>{skill}</span>
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
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
                
                {availableSkills.length === 0 && tempProfile['Skill set'].length === PREDEFINED_SKILLS.length && (
                  <p className="mt-1 text-sm text-gray-500">All available skills have been added.</p>
                )}
              </div>
            ) : (
              <div className="px-4 py-3 border rounded">
                {profile['Skill set']?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile['Skill set'].map((skill) => (
                      <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No skills specified</span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-8 space-x-3">
          {editMode ? (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <Save size={16} className="mr-2" /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;