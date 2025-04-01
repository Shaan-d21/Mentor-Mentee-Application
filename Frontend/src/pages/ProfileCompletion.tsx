import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State for user profile fields
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    gender: "",
    skills: [] as string[],
    // domain: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    gender: "",
    skills: "",
    // domain: "",
  });

  // State for dropdown visibility
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

  // Available skills
  const availableSkills = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "React",
    "Node.js",
    "SQL",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "AWS",
    "Docker",
    "Kubernetes",
    "DevOps",
    "UI/UX Design",
    "Mobile Development",
    "Blockchain",
    "Cloud Computing",
    "Artificial Intelligence",
    "Web Development"
  ];



  const validateContactNumber = (number: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  // const validateDomain = (domain: string) => {
  //   return domain.trim().length >= 3 && domain.trim().length <= 50;
  // };

  // Check profile completion status on component mount
  useEffect(() => {
    const checkProfileStatus = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/auth/login");
        return;
      }

      const userInfo = JSON.parse(userInfoString);

      try {
        // Check if profile is already completed using the role-specific endpoint
        const endpoint = userInfo.role === 'mentor' 
          ? `http://localhost:8000/api/v1/mentor/profile_status?email=${userInfo.email}`
          : `http://localhost:8000/api/v1/mentee/profile_status?email=${userInfo.email}`;
          
        const statusResponse = await axios.get(
          endpoint,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (statusResponse.data.profile_completed) {
          navigate("/dashboard");
          return;
        }

        // If profile is not completed, fetch user details
        const response = await axios.get(
          `http://localhost:8000/api/v1/user?email=${userInfo.email}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          const userData = response.data;
          // Set the profile data without validation since it comes from the backend
          setProfile((prev) => ({
            ...prev,
            full_name: userData.name || "",
            email: userData.mail || userData.email || "", // Handle both mail and email fields
          }));
        }
      } catch (error: any) {
        console.error("Error checking profile status:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userInfo");
          navigate("/auth/login");
        } else if (error.response?.status === 404) {
          toast.error("User not found. Please try logging in again.");
          navigate("/auth/login");
        } else {
          console.error("Error response:", error.response?.data);
          toast.error(error.response?.data?.detail || "Error fetching user details.");
        }
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

  // Handle input change with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let error = "";

    // Validate based on field type
    switch (name) {
      case "contact_number":
        // Only allow numbers and limit to 10 digits
        if (!/^\d*$/.test(value)) {
          error = "Only numbers are allowed";
          return; // Don't update if non-numeric
        }
        if (value.length > 0 && !validateContactNumber(value)) {
          error = "Phone number must be 10 digits and start with 6-9";
        }
        break;

      // case "domain":
      //   if (value && !validateDomain(value)) {
      //     error = "Domain must be between 3 and 50 characters";
      //   }
      //   break;

      case "gender":
        if (!value) {
          error = "Please select a gender";
        }
        break;
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Update profile state
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill selection
  const handleSkillToggle = (skill: string) => {
    setProfile(prev => {
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      
      // Update errors
      setErrors(prev => ({
        ...prev,
        skills: newSkills.length === 0 ? "Please select at least one skill" : ""
      }));

      return {
        ...prev,
        skills: newSkills
      };
    });
  };

  // Form validation before submission
  const validateForm = () => {
    const newErrors = {
      full_name: !profile.full_name.trim() ? "Full name is required" : "",
      email: "", // Remove email validation since it's pre-filled and read-only
      contact_number: !validateContactNumber(profile.contact_number) ? "Invalid phone number" : "",
      gender: !profile.gender ? "Gender is required" : "",
      skills: profile.skills.length === 0 ? "Please select at least one skill" : "",
      // domain: !validateDomain(profile.domain) ? "Invalid domain length" : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting.");
      return;
    }

    try {
      // Retrieve token and user info
      const accessToken = localStorage.getItem("accessToken");
      const userInfoString = localStorage.getItem("userInfo");

      if (!accessToken || !userInfoString) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/auth/login"); // Fixed login path
        return;
      }

      const userInfo = JSON.parse(userInfoString);
      const userRole = userInfo.role?.toLowerCase();

      // Profile Payload - match backend requirements
      const profilePayload = {
        name: profile.full_name.trim(),
        contact: profile.contact_number,
        gender: profile.gender.toLowerCase(),
        github_id: "", // Default value since not collected in form
        exp: 0 // Required field
        // Removed mail field as it's not expected by the backend
      };

      // Headers for API request
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Use role-specific endpoint for profile creation
      const profileEndpoint = userRole === 'mentor'
        ? "http://localhost:8000/api/v1/user/mentor/profile_creation"
        : "http://localhost:8000/api/v1/mentee/profile_creation";

      console.log("Sending profile update to:", profileEndpoint);
      
      // Update User Profile
      const profileResponse = await axios.put(
        profileEndpoint,
        profilePayload,
        { headers }
      );

      if (profileResponse.status === 200) {
        // Update the skills if profile update is successful
        
        // Use role-specific endpoint for skills
        const skillsEndpoint = userRole === 'mentor'
          ? "http://localhost:8000/api/v1/user/mentor/skills"
          : "http://localhost:8000/api/v1/mentee/skills";
          
        console.log("Sending skills update to:", skillsEndpoint);
        
        // Prepare skills payload based on role 
        const skillsPayload = {
          skills: profile.skills.map(skill => ({
            skill_name: skill,
            proficiency: userRole === 'mentor' ? 3 : 1 // Higher proficiency for mentors
          }))
        };

        const skillsResponse = await axios.post(
          skillsEndpoint,
          skillsPayload,
          { headers }
        );

        if (skillsResponse.status === 200) {
          // Update localStorage to mark profile as completed
          userInfo.profileCompleted = true;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          toast.success("Profile completed successfully!");
          
          // Use window.location for a complete page refresh to ensure state is reset
          if (userRole === 'mentor') {
            window.location.href = "/mentor/dashboard";
          } else if (userRole === 'mentee') {
            window.location.href = "/mentee/dashboard";
          } else {
            window.location.href = "/dashboard"; // Fallback
          }
        }
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Show detailed error information
      console.log("Error response:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        navigate("/auth/login");
      } else {
        // Extract error details if available
        let errorDetail = "Failed to update profile. Please try again.";
        
        if (error.response?.data?.detail) {
          // Make sure error.response.data.detail is a string
          if (typeof error.response.data.detail === 'object') {
            // If it's an object with error details, extract useful information
            errorDetail = "Validation error. Please check your inputs.";
            console.error("Validation error:", error.response.data.detail);
          } else {
            errorDetail = String(error.response.data.detail);
          }
        }
        
        toast.error(errorDetail);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Profile</h2>

        {/* Full Name (Pre-filled, Read-Only) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input 
            type="text" 
            name="full_name" 
            value={profile.full_name} 
            className="w-full p-2 border rounded bg-gray-50" 
            readOnly 
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
        </div>

        {/* Email (Pre-filled, Read-Only) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            value={profile.email} 
            className="w-full p-2 border rounded bg-gray-50" 
            readOnly 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            placeholder="Enter 10-digit number" 
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact_number ? 'border-red-500' : ''
            }`}
            value={profile.contact_number}
            onChange={handleChange} 
            maxLength={10}
            required 
          />
          {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
        </div>

        {/* Gender Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gender
            <span className="text-red-500">*</span>
          </label>
          <select 
            name="gender" 
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gender ? 'border-red-500' : ''
            }`}
            value={profile.gender} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

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
                    key={skill}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill}
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
                <label
                  key={skill}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={profile.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          )}
          {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
        </div>

        {/* Domain Input */}
        {/* <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Domain
            <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="domain" 
            placeholder="Enter your domain (3-50 characters)" 
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.domain ? 'border-red-500' : ''
            }`}
            value={profile.domain}
            onChange={handleChange} 
            required 
          />
          {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
        </div> */}

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileCompletion;
