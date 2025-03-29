import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../components/Header";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menteeRequests, setMenteeRequests] = useState<any[]>([]);
  const [activeMentees, setActiveMentees] = useState<any[]>([]);
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

    const fetchMenteeRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/mentor/mentee-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setMenteeRequests(response.data);
      } catch (error) {
        console.error("Error fetching mentee requests:", error);
        toast.error("Error fetching mentee requests");
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveMentees = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/api/v1/mentor/mentees",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setActiveMentees(response.data);
      } catch (error) {
        console.error("Error fetching active mentees:", error);
        toast.error("Error fetching active mentees");
      }
    };

    fetchUserInfo();
    fetchMenteeRequests();
    fetchActiveMentees();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/auth/login");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/mentor/accept-request/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Request accepted successfully!");
      // Refresh mentee requests
      const response = await axios.get(
        "http://localhost:8000/api/v1/mentor/mentee-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMenteeRequests(response.data);
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Error accepting request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await axios.post(
        `http://localhost:8000/api/v1/mentor/reject-request/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Request rejected successfully!");
      // Refresh mentee requests
      const response = await axios.get(
        "http://localhost:8000/api/v1/mentor/mentee-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMenteeRequests(response.data);
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting request");
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
      <Header title="Mentor Dashboard" userRole="mentor" />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mentee Requests</h2>
            {menteeRequests.length === 0 ? (
              <p className="text-gray-500">No pending mentee requests.</p>
            ) : (
              <div className="space-y-4">
                {menteeRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {request.mentee_name}
                      </h3>
                      <p className="text-sm text-gray-500">{request.mentee_email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
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

export default MentorDashboard; 