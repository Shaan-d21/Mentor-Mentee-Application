import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileCompletion = () => {
  const navigate = useNavigate();

  // State for user profile fields
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    contact_number: "",
    gender: "",
    skills: "",
    domain: "",
  });

  // Check profile completion status on component mount
  useEffect(() => {
    const checkProfileStatus = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      const userInfo = JSON.parse(userInfoString);

      try {
        // Check if profile is already completed
        const statusResponse = await axios.get(
          `http://localhost:8000/api/v1/mentee/profile_status?email=${userInfo.email}`,
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
          console.log("User details:", response.data); // Debug log
          setProfile((prev) => ({
            ...prev,
            full_name: response.data.name || "",
            email: response.data.mail || "",
          }));
        }
      } catch (error: any) {
        console.error("Error checking profile status:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userInfo");
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error("User not found. Please try logging in again.");
          navigate("/login");
        } else {
          console.error("Error response:", error.response?.data);
          toast.error(error.response?.data?.detail || "Error fetching user details.");
        }
      }
    };

    checkProfileStatus();
  }, [navigate]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate contact number (only 10 digits)
    if (name === "contact_number" && !/^\d{0,10}$/.test(value)) return;

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!profile.contact_number || !profile.gender || !profile.skills || !profile.domain) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      // Retrieve token and user info
      const accessToken = localStorage.getItem("accessToken");
      const userInfoString = localStorage.getItem("userInfo");

      if (!accessToken || !userInfoString) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      const userInfo = JSON.parse(userInfoString);

      // Profile Payload
      const profilePayload = {
        name: profile.full_name,
        mail: profile.email,
        contact: profile.contact_number,
        gender: profile.gender.toLowerCase(), // Convert to lowercase to match backend constraints
      };

      // Headers for API request
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Update Mentee Profile
      const profileResponse = await axios.put(
        "http://localhost:8000/api/v1/mentee/profile_creation",
        profilePayload,
        { headers }
      );

      if (profileResponse.status === 200) {
        // Update localStorage
        userInfo.profileCompleted = true;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        toast.success("Profile completed successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // Handle Unauthorized Error (401)
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        navigate("/login");
      } else {
        console.error("Error response:", error.response?.data);
        toast.error(error.response?.data?.detail || "Failed to update profile. Please try again.");
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
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
          <input 
            type="text" 
            name="contact_number" 
            placeholder="Enter 10-digit number" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={profile.contact_number}
            onChange={handleChange} 
            maxLength={10}
            required 
          />
        </div>

        {/* Gender Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
          <select 
            name="gender" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={profile.gender} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Other</option>
          </select>
        </div>

        {/* Skills Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Skills</label>
          <select 
            name="skills" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={profile.skills} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Skill</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="React">React</option>
            <option value="Node.js">Node.js</option>
            <option value="SQL">SQL</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Data Science">Data Science</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        {/* Domain Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Domain</label>
          <input 
            type="text" 
            name="domain" 
            placeholder="Enter your domain" 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={profile.domain}
            onChange={handleChange} 
            required 
          />
        </div>

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
