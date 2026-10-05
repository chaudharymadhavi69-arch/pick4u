import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext"; // ✅ ADDED
import axios from "axios";

const DriverDashboard = () => {
  const { user } = useAuth();
  const socket = useSocket(); // ✅ ADDED

  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    pendingJobs: 0,
    activeJobs: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverProfile, setDriverProfile] = useState(null); // ✅ ADDED

  useEffect(() => {
    fetchDashboardData();

    // ✅ Listen for KYC approval via socket
    if (socket) {
      socket.on("kyc-approved", (approvedDriver) => {
        if (approvedDriver.user?._id === user?._id) {
          alert("🎉 Your KYC has been approved! You can now accept jobs.");
          fetchDashboardData(); // Refresh dashboard
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("kyc-approved");
      }
    };
  }, [socket, user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Fetch driver profile
      const profileResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDriverProfile(profileResponse.data);

      // ✅ Fetch earnings
      const earningsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/earnings",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Fetch jobs
      const jobsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/jobs",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Fetch reports
      const reportsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/reports",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats({
        totalEarnings: earningsResponse.data.earnings || 0,
        completedJobs: reportsResponse.data.totalJobs || 0,
        pendingJobs: jobsResponse.data.length || 0,
        activeJobs: jobsResponse.data.filter((job) =>
          ["accepted", "picked-up", "on-the-way"].includes(job.status)
        ).length,
      });

      setRecentJobs(jobsResponse.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              {driverProfile?.kycStatus === "APPROVED"
                ? "Ready to accept new delivery jobs?"
                : "Complete KYC to start accepting jobs."}
            </p>
          </div>

          {/* ✅ Improved KYC Status */}
          {driverProfile?.kycStatus !== "APPROVED" && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                    {driverProfile?.kycStatus === "PENDING"
                      ? "KYC Under Review ⏳"
                      : "KYC Verification Required 📋"}
                  </h3>
                  <p className="text-yellow-700">
                    {driverProfile?.kycStatus === "PENDING"
                      ? "Your documents are under review. You will be notified once approved."
                      : "Complete KYC verification to start accepting delivery jobs."}
                  </p>
                </div>
                <Link
                  to="/driver/kyc"
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  {driverProfile?.kycStatus === "PENDING"
                    ? "Check Status"
                    : "Complete KYC"}
                </Link>
              </div>
            </div>
          )}

          {/* ✅ KYC Approved Banner */}
          {driverProfile?.kycStatus === "APPROVED" && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-green-600 text-xl mr-3">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">
                    KYC Approved!
                  </h3>
                  <p className="text-green-700">
                    You are now eligible to accept delivery jobs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon="💰"
              title="Total Earnings"
              value={`₹${stats.totalEarnings}`}
              color="green"
            />
            <StatCard
              icon="✅"
              title="Completed Jobs"
              value={stats.completedJobs}
              color="blue"
            />
            <StatCard
              icon="⏳"
              title="Active Jobs"
              value={stats.activeJobs}
              color="yellow"
            />
            <StatCard
              icon="📦"
              title="Available Jobs"
              value={stats.pendingJobs}
              color="purple"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <QuickAction
              to="/driver/jobs"
              bg="bg-blue-600"
              hover="hover:bg-blue-700"
              emoji="🚚"
              title="Available Jobs"
              desc="Accept new delivery requests"
            />
            <QuickAction
              to="/driver/my-jobs"
              bg="bg-green-600"
              hover="hover:bg-green-700"
              emoji="📋"
              title="My Jobs"
              desc="View your assigned jobs"
            />
            <QuickAction
              to="/driver/earnings"
              bg="bg-purple-600"
              hover="hover:bg-purple-700"
              emoji="💰"
              title="Earnings"
              desc="View your earnings report"
            />
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Jobs
              </h2>
              <Link
                to="/driver/my-jobs"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View All
              </Link>
            </div>

            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{job._id?.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {job.pickupAddress?.slice(0, 30)}... →{" "}
                        {job.dropAddress?.slice(0, 30)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{job.fare}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          job.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : job.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No active jobs yet</p>
                <Link
                  to="/driver/jobs"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find Available Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ✅ Small Reusable Components */
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`bg-${color}-100 p-3 rounded-lg`}>
        <span className={`text-${color}-600 text-xl`}>{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const QuickAction = ({ to, bg, hover, emoji, title, desc }) => (
  <Link
    to={to}
    className={`${bg} ${hover} text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center text-center`}
  >
    <span className="text-3xl mb-3">{emoji}</span>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{desc}</p>
  </Link>
);

export default DriverDashboard;
