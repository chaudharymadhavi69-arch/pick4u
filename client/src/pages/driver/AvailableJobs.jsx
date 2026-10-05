import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import JobCard from "../../components/driver/JobCard";
import axios from "axios";

const AvailableJobs = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [driverProfile, setDriverProfile] = useState(null);

  console.log("🔌 AvailableJobs - Socket connected:", socket?.connected);
  console.log("🚗 AvailableJobs - Driver profile:", driverProfile);

  // ✅ useCallback se optimize karo
  const fetchDriverProfile = useCallback(async () => {
    try {
      console.log("🔄 Fetching driver profile...");
      const token = localStorage.getItem("token");

      // ✅ Token check
      if (!token) {
        console.error("❌ No token found");
        setDriverProfile({ kycStatus: "NOT_SUBMITTED" });
        return;
      }

      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Driver profile API response:", response.data);

      // ✅ Enhanced validation
      if (response.data && response.data.kycStatus) {
        setDriverProfile(response.data);

        // ✅ LocalStorage persistence
        localStorage.setItem("driverKycStatus", response.data.kycStatus);
        localStorage.setItem("driverProfile", JSON.stringify(response.data));

        console.log("✅ KYC Status updated to:", response.data.kycStatus);
      } else {
        console.error("❌ Invalid profile data received");
        const fallbackProfile = {
          kycStatus: "NOT_SUBMITTED",
          availability: false,
        };
        setDriverProfile(fallbackProfile);
        localStorage.setItem("driverProfile", JSON.stringify(fallbackProfile));
      }
    } catch (error) {
      console.error("❌ Error fetching driver profile:", error);
      const fallbackProfile = {
        kycStatus: "NOT_SUBMITTED",
        availability: false,
      };
      setDriverProfile(fallbackProfile);
      localStorage.setItem("driverProfile", JSON.stringify(fallbackProfile));
    }
  }, []);

  const fetchAvailableJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/orders/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching available jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial data fetch
  useEffect(() => {
    console.log("📥 Initial data fetch starting...");

    // ✅ Pehle localStorage se check karo for instant display
    const storedProfile = localStorage.getItem("driverProfile");
    const storedKycStatus = localStorage.getItem("driverKycStatus");

    if (storedProfile) {
      console.log(
        "📦 Loading profile from localStorage:",
        JSON.parse(storedProfile)
      );
      setDriverProfile(JSON.parse(storedProfile));
    } else if (storedKycStatus) {
      console.log("📦 Loading KYC status from localStorage:", storedKycStatus);
      setDriverProfile({ kycStatus: storedKycStatus });
    }

    fetchDriverProfile();
    fetchAvailableJobs();
  }, [fetchDriverProfile, fetchAvailableJobs]);

  // ✅ Socket listeners - SEPARATE EFFECT
  useEffect(() => {
    if (!socket) {
      console.log("⏳ Waiting for socket connection...");
      return;
    }

    console.log("🎯 Setting up socket listeners...");

    const handleNewOrder = (newOrder) => {
      console.log("📦 New order received:", newOrder);
      setJobs((prev) => [newOrder, ...prev]);
    };

    const handleOrderAccepted = (acceptedOrder) => {
      setJobs((prev) => prev.filter((job) => job._id !== acceptedOrder._id));
    };

    const handleKycApproved = (data) => {
      console.log("🎉 KYC Approved event received:", data);

      // ✅ SIMPLIFIED - Always refresh profile on KYC event
      alert("🎉 Your KYC has been approved! Refreshing profile...");
      fetchDriverProfile();

      // ✅ Force update localStorage
      localStorage.setItem("driverKycStatus", "APPROVED");
    };

    const handleTestEvent = (data) => {
      console.log("🧪 Test event received:", data);
      alert("🧪 Test: " + data.message);
      fetchDriverProfile(); // Test ke time bhi refresh
    };

    socket.on("new-order", handleNewOrder);
    socket.on("order-accepted", handleOrderAccepted);
    socket.on("kyc-approved", handleKycApproved);
    socket.on("test-event", handleTestEvent);

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("new-order", handleNewOrder);
      socket.off("order-accepted", handleOrderAccepted);
      socket.off("kyc-approved", handleKycApproved);
      socket.off("test-event", handleTestEvent);
    };
  }, [socket, fetchDriverProfile]);

  // ✅ Auto-refresh KYC status every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (driverProfile?.kycStatus !== "APPROVED") {
        console.log("🔄 Auto-refreshing KYC status...");
        fetchDriverProfile();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [driverProfile?.kycStatus, fetchDriverProfile]);

  // ✅ Real-time KYC status check - Page focus pe refresh
  useEffect(() => {
    const handleFocus = () => {
      console.log("🎯 Page focused, checking KYC status...");
      fetchDriverProfile();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchDriverProfile]);

  const handleAcceptJob = async (jobId) => {
    // ✅ Double-check KYC status before accepting
    const currentStatus =
      driverProfile?.kycStatus || localStorage.getItem("driverKycStatus");

    if (currentStatus !== "APPROVED") {
      alert(
        `❌ KYC Status: ${
          currentStatus || "NOT_SUBMITTED"
        }. Please complete KYC verification.`
      );

      // Force refresh profile
      await fetchDriverProfile();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Job accepted successfully!");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      alert(
        "❌ Error accepting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job rejected");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      alert(
        "Error rejecting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  // ✅ Manual refresh functions
  const manuallyCheckKYC = async () => {
    console.log("🔄 Manually checking KYC status...");
    await fetchDriverProfile();
    const currentStatus =
      driverProfile?.kycStatus || localStorage.getItem("driverKycStatus");
    console.log("📊 Current KYC Status:", currentStatus);
    alert(`Current KYC Status: ${currentStatus || "NOT_SUBMITTED"}`);
  };

  const forceRefreshPage = () => {
    console.log("🔄 Force refreshing page...");
    window.location.reload();
  };

  // ✅ Force sync function
  const forceSyncKYC = async () => {
    console.log("🔄 Force syncing KYC status...");

    // Clear localStorage and refetch
    localStorage.removeItem("driverKycStatus");
    localStorage.removeItem("driverProfile");

    await fetchDriverProfile();

    const currentStatus =
      driverProfile?.kycStatus || localStorage.getItem("driverKycStatus");
    alert(`Force Sync Complete!\nKYC Status: ${currentStatus}`);
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "high-value") return job.fare > 100;
    if (filter === "short-distance") return true;
    return true;
  });

  // ✅ IMPROVED KYC status detection
  const getCurrentKycStatus = () => {
    // Priority: 1. Component state → 2. LocalStorage → 3. Default
    if (driverProfile?.kycStatus) {
      return driverProfile.kycStatus;
    }

    const storedStatus = localStorage.getItem("driverKycStatus");
    if (storedStatus) {
      return storedStatus;
    }

    return "NOT_SUBMITTED";
  };

  const currentKycStatus = getCurrentKycStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
            <p className="text-gray-600">
              Accept new delivery requests and start earning
            </p>

            {/* ✅ DEBUG BUTTONS */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={manuallyCheckKYC}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
              >
                🔄 Check KYC Status
              </button>
              <button
                onClick={forceSyncKYC}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700"
              >
                🔄 Force Sync KYC
              </button>
              <button
                onClick={forceRefreshPage}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>

          {/* ✅ DEBUG INFO DISPLAY */}
          <div className="mb-6 p-4 rounded-lg border-2 border-blue-300 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <p>
                <strong>Socket:</strong>{" "}
                {socket?.connected ? "✅ Connected" : "❌ Disconnected"}
              </p>
              <p>
                <strong>KYC Status:</strong>{" "}
                <span className="font-bold">{currentKycStatus}</span>
              </p>
              <p>
                <strong>Driver ID:</strong> {driverProfile?._id || "Loading..."}
              </p>
              <p>
                <strong>Available Jobs:</strong> {jobs.length}
              </p>
              <p>
                <strong>Socket ID:</strong> {socket?.id || "No socket"}
              </p>
              <p>
                <strong>Auto-refresh:</strong>{" "}
                {currentKycStatus !== "APPROVED" ? "✅ Active" : "❌ Inactive"}
              </p>
            </div>
          </div>

          {/* ✅ KYC STATUS MESSAGES */}
          {currentKycStatus !== "APPROVED" ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    {currentKycStatus === "PENDING"
                      ? "KYC Under Review"
                      : "KYC Verification Required"}
                  </h3>
                  <p className="text-yellow-700">
                    Current Status: <strong>{currentKycStatus}</strong>
                    <br />
                    {currentKycStatus === "PENDING"
                      ? "Your KYC documents are under review. This page will auto-refresh."
                      : "You need to complete KYC verification before accepting jobs."}{" "}
                    <a
                      href="/driver/kyc"
                      className="underline font-medium text-blue-700 hover:text-blue-800"
                    >
                      {currentKycStatus === "PENDING"
                        ? "Check Status"
                        : "Complete KYC"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">
                    KYC Approved!
                  </h3>
                  <p className="text-green-700">
                    You can now accept delivery jobs and start earning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ STATS & FILTERS */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {filteredJobs.length} Available{" "}
                  {filteredJobs.length === 1 ? "Job" : "Jobs"}
                </h3>
                <p className="text-gray-600">
                  Real-time delivery requests in your area
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Jobs
                </button>
                <button
                  onClick={() => setFilter("high-value")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "high-value"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  High Value
                </button>
                <button
                  onClick={() => setFilter("short-distance")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "short-distance"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Short Distance
                </button>
              </div>
            </div>
          </div>

          {/* ✅ JOBS GRID */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onReject={handleRejectJob}
                  showActions={currentKycStatus === "APPROVED"}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Available Jobs
              </h3>
              <p className="text-gray-600 mb-6">
                There are no delivery requests available at the moment. New jobs
                will appear here in real-time.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-blue-700">
                  💡 Tips: Keep the app open to receive instant job
                  notifications
                </p>
              </div>
            </div>
          )}

          {/* ✅ REAL-TIME INDICATOR */}
          {jobs.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live - New jobs appear in real-time
              </div>
            </div>
          )}

          {/* ✅ AUTO-REFRESH STATUS */}
          {currentKycStatus !== "APPROVED" && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Auto-refreshing KYC status every 15 seconds
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AvailableJobs;
