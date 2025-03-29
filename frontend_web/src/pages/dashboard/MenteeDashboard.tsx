import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [approvedMentors, setApprovedMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoString = localStorage.getItem("userInfo");
      const accessToken = localStorage.getItem("accessToken");

      if (!userInfoString || !accessToken) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/auth/login");
        return;
      }

      try {
        const userInfo = JSON.parse(userInfoString);
        const response = await axios.get(
          `http://localhost:8000/api/v1/user?email=${userInfo.email}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Error fetching user information");
        navigate("/auth/login");
      }
    };

    const fetchApprovedMentors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/mentee/approved-mentors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setApprovedMentors(response.data);
      } catch (error) {
        console.error("Error fetching approved mentors:", error);
        toast.error("Error fetching approved mentors");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchApprovedMentors();
  }, [navigate]);

  const handleRequestMentor = async (mentorId: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/mentee/request-mentor/${mentorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Mentor request sent successfully!");
    } catch (error) {
      console.error("Error requesting mentor:", error);
      toast.error("Error requesting mentor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Mentee Dashboard" userRole="mentee" />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Mentors</h2>
            {approvedMentors.length === 0 ? (
              <p className="text-gray-500">No mentors available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={mentor.profile_pic_url || "https://www.freeiconspng.com/thumbs/profile-icon-png/user-icons--download-14403-free--premium-icons-on-iconfinder-15.png"}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full border"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Expertise:</span>{" "}
                        {mentor.expertise || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Experience:</span>{" "}
                        {mentor.experience || "Not specified"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRequestMentor(mentor.id)}
                      className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Request Mentor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenteeDashboard; 