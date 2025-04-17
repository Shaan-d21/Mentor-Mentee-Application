import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import axios from "axios";

// Define the skill interface to handle both mentor and mentee skills
interface MentorSkill {
  name: string;
  proficiency: number;
}

interface MenteeSkill {
  name: string;
}

// Remove unused Skill type
interface Profile {
  full_name: string;
  email: string;
  contact_number: string;
  designation: string;
  experience: number;
  skills: (MentorSkill | MenteeSkill)[];
  domain?: string;
}

interface ValidationErrors {
  full_name: string;
  email: string;
  contact_number: string;
  designation: string;
  experience: string;
  skills: string;
  domain: string;
}

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  // State for user profile fields with ALL possible fields
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
    contact_number: "",
    designation: "", // Default designation
    experience: 0, // Default experience
    skills: [] as (MentorSkill | MenteeSkill)[],
    // Optional mentor fields
    domain: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState<ValidationErrors>({
    full_name: '',
    email: '',
    contact_number: '',
    designation: '',
    experience: '',
    skills: '',
    domain: ''
  });

  // State for dropdown visibility
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

  // Available skills
  const availableSkills = [
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

  // Add ProficiencyLevel type
  const ProficiencyLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Intermediate" },
    { value: 3, label: "Advanced" }
  ];

  // Add a role state at the top of the component with other state variables
  const [role, setRole] = useState<string>('mentee');

  // Add predefined domains list
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

  // Validation functions
  const validateName = (name: string): { isValid: boolean; error?: string } => {
    if (!name) {
      return { isValid: false, error: 'Name is required' };
    }
    if (/[0-9]/.test(name)) {
      return { isValid: false, error: 'Name should not contain numbers' };
    }
    if (/\s{2,}/.test(name)) {
      return { isValid: false, error: 'Name should not contain multiple spaces' };
    }
    if (name.startsWith(' ') || name.endsWith(' ')) {
      return { isValid: false, error: 'Name should not start or end with spaces' };
    }
    return { isValid: true };
  };

  const validateContact = (contact: string): { isValid: boolean; error?: string } => {
    if (!contact) {
      return { isValid: false, error: 'Contact number is required' };
    }
    if (!/^\d+$/.test(contact)) {
      return { isValid: false, error: 'Contact number should only contain digits' };
    }
    if (contact.length < 10) {
      return { isValid: false, error: 'Contact number must be at least 10 digits' };
    }
    if (contact.length > 10) {
      return { isValid: false, error: 'Contact number must not exceed 10 digits' };
    }
    return { isValid: true };
  };

  const validateDesignation = (designation: string): { isValid: boolean; error?: string } => {
    if (!designation) {
      return { isValid: false, error: 'Designation is required' };
    }
    if (/^\d+$/.test(designation)) {
      return { isValid: false, error: 'Designation should not consist only of numbers' };
    }
    return { isValid: true };
  };

  const validateExperience = (experience: number): { isValid: boolean; error?: string } => {
    if (experience < 0) {
      return { isValid: false, error: 'Experience cannot be negative' };
    }
    if (experience > 50) {
      return { isValid: false, error: 'Experience cannot exceed 50 years' };
    }
    return { isValid: true };
  };

  // Check profile completion status on component mount
  useEffect(() => {
    const checkProfileStatus = async () => {
      setLoading(true);
      
      try {
        // Get data from localStorage
        const accessToken = localStorage.getItem('accessToken');
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        const userRole = localStorage.getItem('role');
        
        console.log("Initial data from localStorage:", {
          token: accessToken ? `${accessToken.substring(0, 10)}...` : 'missing',
          email: email || 'missing',
          name: name || 'missing',
          role: userRole || 'missing'
        });
        
        // Store the role in component state
        setRole(userRole || 'mentee');
        
        // Check token
        if (!accessToken) {
          console.error("No access token found, redirecting to login");
          toast.error("Please log in to continue");
          navigate('/auth/login');
          return;
        }
        
        // Set default values from localStorage
        setProfile(prev => ({
          ...prev,
          email: email || '',
          full_name: name || ''
        }));
        
        // Attempt to get user data from backend 
        try {
          const response = await api.get('/users/all_users');
          console.log("All users response:", response.data);
          
          // Check if user exists in database
          if (email) {
            // Try to find the user by email in different possible formats
            const user = response.data.find((u: any) => 
              (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
              (u.mail && u.mail.toLowerCase() === email.toLowerCase())
            );
            
            if (user) {
              console.log("User found in database:", user);
              // Update profile with data from backend
              setProfile(prev => ({
                ...prev,
                email: user.email || user.mail || email,
                full_name: user.name || user.fullname || name || ''
              }));
            } else {
              console.log("User not found in database, using localStorage data");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          console.log("Continuing with localStorage data");
        }
      } catch (error) {
        console.error("Error initializing profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSkillsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update profile state first
    if (name === 'contact_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setProfile(prev => ({
        ...prev,
        [name]: numericValue
      }));

      // Validate contact number immediately
      const contactValidation = validateContact(numericValue);
      setErrors(prev => ({
        ...prev,
        contact_number: contactValidation.error || ''
      }));
    } else if (name === 'full_name') {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate name immediately
      const nameValidation = validateName(value);
      setErrors(prev => ({
        ...prev,
        full_name: nameValidation.error || ''
      }));
    } else if (name === 'designation') {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate designation immediately
      const designationValidation = validateDesignation(value);
      setErrors(prev => ({
        ...prev,
        designation: designationValidation.error || ''
      }));
    } else if (name === 'experience') {
      const numericValue = Number(value);
      setProfile(prev => ({
        ...prev,
        [name]: numericValue
      }));

      // Validate experience immediately
      const experienceValidation = validateExperience(numericValue);
      setErrors(prev => ({
        ...prev,
        experience: experienceValidation.error || ''
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add a function to update skill proficiency (for mentors only)
  const updateSkillProficiency = (skillName: string, proficiency: number) => {
    setProfile(prev => {
      const newSkills = prev.skills.map(skill => {
        if (typeof skill === 'string') {
          return { name: skill, proficiency } as MentorSkill;
        }
        if (skill.name === skillName) {
          return { ...skill, proficiency } as MentorSkill;
        }
        return skill;
      });
      
      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  // Handle skill selection/deselection
  const handleSkillToggle = (skill: string) => {
    setProfile(prev => {
      const existingSkillIndex = prev.skills.findIndex(s => 
        typeof s === 'string' ? s === skill : s.name === skill
      );
      
      if (existingSkillIndex >= 0) {
        // Remove skill
        const newSkills = [...prev.skills];
        newSkills.splice(existingSkillIndex, 1);
        return { ...prev, skills: newSkills };
      } else {
        // Add skill with default proficiency for mentors
        const newSkill = role === 'mentor' 
          ? { name: skill, proficiency: 2 } as MentorSkill
          : { name: skill } as MenteeSkill;
        
        const newSkills = [...prev.skills, newSkill];
        
        // Clear error if we now have skills
        if (newSkills.length > 0) {
          setErrors(prev => ({ ...prev, skills: '' }));
        }
        
        return { ...prev, skills: newSkills };
      }
    });
  };

  // Type guard to check if a skill is a MentorSkill
  const isMentorSkill = (skill: MentorSkill | MenteeSkill): skill is MentorSkill => {
    return 'proficiency' in skill;
  };

  // Form validation before submission
  const validateForm = () => {
    const nameValidation = validateName(profile.full_name);
    const contactValidation = validateContact(profile.contact_number);
    const designationValidation = validateDesignation(profile.designation);
    const experienceValidation = validateExperience(profile.experience);
    
    const newErrors: ValidationErrors = {
      full_name: nameValidation.error || '',
      email: '',
      contact_number: contactValidation.error || '',
      designation: designationValidation.error || '',
      experience: experienceValidation.error || '',
      skills: profile.skills.length === 0 ? "Please select at least one skill" : "",
      domain: role === 'mentor' && !profile.domain ? "Please select a domain" : ""
    };

    setErrors(newErrors);

    // Check if there are any errors
    return nameValidation.isValid && 
           contactValidation.isValid && 
           designationValidation.isValid && 
           experienceValidation.isValid && 
           profile.skills.length > 0 && 
           (role !== 'mentor' || profile.domain);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting.');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        toast.error('Authentication token not found. Please log in again.');
        navigate('/auth/login');
        return;
      }
      
      // Ensure token has Bearer prefix
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log(`Using token: ${authToken.substring(0, 15)}... (length: ${authToken.length})`);
      console.log('Token header format:', authToken);
      
      // Use deployed API URL
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Create role-specific profile
      const userRole = localStorage.getItem('role');
      
      if (userRole === 'mentor') {
        // Create basic profile first
        const profileData = {
          name: profile.full_name,
          designation: profile.designation,
          exp: Number(profile.experience),
          contact: profile.contact_number,
          domain_name: profile.domain
        };
        
        console.log('Creating mentor profile:', profileData);
        console.log('Using API URL:', apiUrl);
        
        const profileResponse = await axios.put(
          `${apiUrl}/users/mentor/profile_creation`,
          profileData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': authToken,
            },
          }
        );
        
        console.log('Mentor profile creation response:', profileResponse.data);
        
        // Format and create skills
        const skillsPayload = profile.skills
          .filter(isMentorSkill)
          .map(skill => ({
            skill_name: skill.name,
            proficiency: skill.proficiency,
          }));
        
        console.log('Creating mentor skills:', skillsPayload);
        
        if (skillsPayload.length > 0) {
          try {
            const skillsResponse = await axios.post(
              `${apiUrl}/users/mentor/skills`,
              { skills: skillsPayload },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Token': authToken,
                },
              }
            );
            console.log('Skills creation response:', skillsResponse.data);
          } catch (skillError) {
            console.error('Error creating mentor skills:', skillError);
            // Continue despite skill error - profile is created
          }
        }
        
        // Update localStorage and navigate
        localStorage.setItem('profile_status', 'complete');
        toast.success('Profile completed successfully!');
        navigate('/mentor/dashboard');
      } else if (userRole === 'mentee') {
        // Create basic mentee profile first
        const menteeProfileData = {
          name: profile.full_name,
          contact: profile.contact_number,
          designation: profile.designation, // Add designation to mentee profile
        };
        
        console.log('Creating mentee profile:', menteeProfileData);
        console.log('Headers:', {
          'Content-Type': 'application/json',
          'Token': authToken,
        });
        
        const profileResponse = await axios.put(
          `${apiUrl}/mentee/mentee/profile_creation`,
          menteeProfileData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': authToken,
            },
          }
        );
        
        console.log('Mentee profile creation response:', profileResponse.data);
        
        // Format and create mentee skills (no proficiency)
        const menteeSkillsPayload = {
          skills: profile.skills.map(skill => ({
            skill_name: typeof skill === 'string' ? skill : skill.name
          }))
        };
        
        console.log('Creating mentee skills:', menteeSkillsPayload);
        
        if (profile.skills.length > 0) {
          try {
            const skillsResponse = await axios.post(
              `${apiUrl}/mentee/mentee/skills`,
              menteeSkillsPayload,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Token': authToken,
                },
              }
            );
            console.log('Mentee skills creation response:', skillsResponse.data);
            
            // Store skills in localStorage for backup
            localStorage.setItem('menteeSkills', JSON.stringify(profile.skills.map(s => typeof s === 'string' ? s : s.name)));
          } catch (skillError) {
            console.error('Error creating mentee skills:', skillError);
            // Continue despite skill error
          }
        }
        
        // Update localStorage and navigate
        localStorage.setItem('profile_status', 'complete');
        localStorage.setItem('name', profile.full_name);
        localStorage.setItem('userContact', profile.contact_number);
        toast.success('Profile completed successfully!');
        navigate('/mentee/dashboard');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Error completing profile:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        // Display more detailed error information
        if (error.response?.data?.detail) {
          console.error('Error detail:', error.response.data.detail);
          setError(`Server error: ${error.response.data.detail}`);
          toast.error(`Profile error: ${error.response.data.detail}`);
        } else {
          // Handle token errors
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            toast.error('Your session has expired. Please log in again.');
            navigate('/auth/login');
          } else {
            setError(error.response?.data?.detail || 'An error occurred while creating your profile.');
            toast.error('Failed to complete profile. Please try again.');
          }
        }
      } else {
        setError('An unexpected error occurred.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Preparing profile completion..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Profile</h2>

        {/* Full Name - editable */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
            <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="full_name" 
            value={profile.full_name} 
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? 'border-red-500' : ''
            }`} 
            required 
            placeholder="Enter your full name"
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>

        {/* Email - read-only since it's tied to authentication */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            value={profile.email} 
            className="w-full p-2 border rounded bg-gray-50" 
            readOnly 
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed (tied to your account)</p>
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Contact Number
            <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="contact_number" 
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact_number ? 'border-red-500' : ''
            }`}
            value={profile.contact_number}
            onChange={handleChange} 
            placeholder="10-digit phone number"
            maxLength={10}
            required 
          />
          {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
        </div>

        {/* Designation field for mentors and mentees (since both need it now) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Designation
            <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="designation" 
            value={profile.designation} 
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required 
            placeholder={role === 'mentor' ? "Your job title (e.g. Senior Developer)" : "Your current role (e.g., Intern, Developer)"}
          />
        </div>

        {/* Experience field for mentors only */}
        {role === 'mentor' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Years of Experience
              <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              name="experience" 
              value={profile.experience} 
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.experience ? 'border-red-500' : ''
              }`}
              min="1"
              max="50"
              required 
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
            )}
          </div>
        )}

        {/* Add Domain dropdown for mentors */}
        {role === 'mentor' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Domain
              <span className="text-red-500">*</span>
            </label>
            <select
              name="domain"
              value={profile.domain}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.domain ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Select a domain</option>
              {predefinedDomains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
          </div>
        )}

        {/* Skills Multi-select Dropdown */}
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Skills
            <span className="text-red-500">*</span>
          </label>
          <div
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
              errors.skills ? 'border-red-500' : ''
            }`}
            onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
          >
            <div className="flex flex-wrap gap-1">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span
                    key={typeof skill === 'string' ? skill : skill.name}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                    {role === 'mentor' && isMentorSkill(skill) && (
                      <span className="ml-1 bg-blue-200 px-1 rounded-full text-xs">
                        {ProficiencyLevels.find(l => l.value === skill.proficiency)?.label || 'Intermediate'}
                      </span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Select skills</span>
              )}
            </div>
          </div>
          {isSkillsDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {availableSkills.map((skill) => (
                <div key={skill} className="mb-2">
                  <div className="flex items-center px-3 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={profile.skills.some(s => 
                        typeof s === 'string' ? s === skill : s.name === skill
                      )}
                      onChange={() => handleSkillToggle(skill)}
                    />
                    <span>{skill}</span>
                  </div>
                  
                  {role === 'mentor' && profile.skills.some(s => 
                    typeof s !== 'string' && s.name === skill && isMentorSkill(s)
                  ) && (
                    <div className="mt-1 ml-6 px-3 py-1">
                      <select
                        className="text-sm border rounded p-1"
                        value={(profile.skills.find(s => 
                          typeof s !== 'string' && s.name === skill && isMentorSkill(s)
                        ) as MentorSkill)?.proficiency || 2}
                        onChange={(e) => updateSkillProficiency(skill, parseInt(e.target.value))}
                      >
                        {ProficiencyLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Complete Profile"}
        </button>
        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default ProfileCompletion;