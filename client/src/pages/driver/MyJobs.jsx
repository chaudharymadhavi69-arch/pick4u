import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import JobCard from "../../components/driver/JobCard";
import axios from "axios";

const MyJobs = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]); // ✅ NEW: Separate completed jobs
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyJobs();

    // ✅ Socket events for real-time updates
    if (socket) {
      socket.on("order-accepted", (data) => {
        console.log("🎯 New job accepted, refreshing list...");
        fetchMyJobs();
      });

      socket.on("order-delivered", (data) => {
        console.log("✅ Job delivered, refreshing list...");
        fetchMyJobs();
      });

      socket.on("order-assigned", (data) => {
        console.log("📦 New job assigned, refreshing list...");
        fetchMyJobs();
      });
    }

    return () => {
      if (socket) {
        socket.off("order-accepted");
        socket.off("order-delivered");
        socket.off("order-assigned");
      }
    };
  }, [socket]);

  const fetchMyJobs = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      console.log("🔄 Fetching my jobs...");

      // ✅ Fetch active/assigned jobs
      const jobsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ NEW: Fetch completed jobs from reports
      const reportsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/reports",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Active jobs API response:", jobsResponse.data);
      console.log("✅ Completed jobs API response:", reportsResponse.data);

      // ✅ Set active jobs
      if (Array.isArray(jobsResponse.data)) {
        setJobs(jobsResponse.data);
      } else {
        console.error(
          "❌ Active jobs API didn't return array:",
          jobsResponse.data
        );
        setJobs([]);
      }

      // ✅ NEW: Set completed jobs
      if (reportsResponse.data.completedJobs) {
        setCompletedJobs(reportsResponse.data.completedJobs);
      } else if (Array.isArray(reportsResponse.data)) {
        // Agar reports API array return karta hai
        setCompletedJobs(reportsResponse.data);
      } else {
        console.error(
          "❌ Completed jobs API format unexpected:",
          reportsResponse.data
        );
        setCompletedJobs([]);
      }
    } catch (error) {
      console.error("❌ Error fetching my jobs:", error);
      setError("Failed to load jobs. Please try again.");
      setJobs([]);
      setCompletedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debug function to check API directly
  const debugCheckJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("🔍 DEBUG - Checking all job APIs...");

      const activeJobsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/jobs",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reportsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/reports",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("🔍 Active Jobs API:", activeJobsResponse.data);
      console.log("🔍 Reports API:", reportsResponse.data);

      alert(
        `Active Jobs: ${JSON.stringify(
          activeJobsResponse.data,
          null,
          2
        )}\n\nReports: ${JSON.stringify(reportsResponse.data, null, 2)}`
      );
    } catch (error) {
      console.error("DEBUG Error:", error);
      alert(`DEBUG Error: ${error.message}`);
    }
  };

  // ✅ Safe filtering - include both active and completed jobs
  const filteredJobs = () => {
    if (filter === "active") {
      return Array.isArray(jobs)
        ? jobs.filter((job) =>
            [
              "assigned",
              "accepted",
              "arrived",
              "picked-up",
              "on-the-way",
            ].includes(job.status)
          )
        : [];
    } else if (filter === "completed") {
      return Array.isArray(completedJobs) ? completedJobs : [];
    }
    return [];
  };

  // ✅ Status count mein dono types include karo
  const getStatusCount = (statusFilter) => {
    if (statusFilter === "active") {
      return Array.isArray(jobs)
        ? jobs.filter((job) =>
            [
              "assigned",
              "accepted",
              "arrived",
              "picked-up",
              "on-the-way",
            ].includes(job.status)
          ).length
        : 0;
    } else if (statusFilter === "completed") {
      return Array.isArray(completedJobs) ? completedJobs.length : 0;
    }
    return 0;
  };

  // ✅ NEW: Accept assigned job
  const acceptAssignedJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Job accepted successfully!");
      fetchMyJobs();
    } catch (error) {
      console.error("❌ Error accepting job:", error);
      alert(
        "Error accepting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  // ✅ NEW: Reject assigned job
  const rejectAssignedJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("❌ Job rejected");
      fetchMyJobs();
    } catch (error) {
      console.error("❌ Error rejecting job:", error);
      alert(
        "Error rejecting job: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      const token = localStorage.getItem("token");

      let endpoint = "";
      switch (status) {
        case "arrived":
          endpoint = `arrived`;
          break;
        case "picked-up":
          endpoint = `picked-up`;
          break;
        case "on-the-way":
          endpoint = `on-the-way`;
          break;
        case "delivered":
          endpoint = `delivered`;
          break;
        default:
          return;
      }

      console.log(`🔄 Updating job ${jobId} to ${status}`);

      await axios.put(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`✅ Status updated to ${status.replace("-", " ")}`);
      fetchMyJobs(); // Refresh jobs list
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(
        "❌ Error updating status: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4 text-red-500">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Error Loading Jobs
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchMyJobs}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={debugCheckJobs}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                🔍 Debug Check
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentFilteredJobs = filteredJobs();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Debug */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Jobs</h1>
                <p className="text-gray-600">
                  Manage your assigned delivery jobs
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchMyJobs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  🔄 Refresh
                </button>
                <button
                  onClick={debugCheckJobs}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                >
                  🔍 Debug
                </button>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <p>
                <strong>Active Jobs:</strong>{" "}
                {Array.isArray(jobs) ? jobs.length : 0}
              </p>
              <p>
                <strong>Completed Jobs:</strong>{" "}
                {Array.isArray(completedJobs) ? completedJobs.length : 0}
              </p>
              <p>
                <strong>Filtered Jobs:</strong> {currentFilteredJobs.length}
              </p>
              <p>
                <strong>Assigned Jobs:</strong>{" "}
                {Array.isArray(jobs)
                  ? jobs.filter((job) => job.status === "assigned").length
                  : 0}
              </p>
              <p>
                <strong>Socket:</strong> {socket?.connected ? "✅" : "❌"}
              </p>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {getStatusCount("active")}
                  </p>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {getStatusCount("completed")}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {Array.isArray(jobs)
                      ? jobs.filter((job) => job.status === "assigned").length
                      : 0}
                  </p>
                  <p className="text-sm text-gray-600">Pending Acceptance</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-600">
                    {getStatusCount("active") + getStatusCount("completed")}
                  </p>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === "active"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active ({getStatusCount("active")})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === "completed"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed ({getStatusCount("completed")})
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          {currentFilteredJobs.length > 0 ? (
            <div className="space-y-6">
              {currentFilteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  <JobCard job={job} showActions={false} />

                  {/* ✅ NEW: Job Acceptance Buttons for Assigned Jobs */}
                  {job.status === "assigned" && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                        <span className="text-lg mr-2">🔄</span>
                        Job Assignment - Action Required
                      </h4>
                      <p className="text-yellow-700 mb-4">
                        You have been assigned this job. Please accept or reject
                        it.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => acceptAssignedJob(job._id)}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center"
                        >
                          <span className="mr-2">✅</span>
                          Accept Job
                        </button>
                        <button
                          onClick={() => rejectAssignedJob(job._id)}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center"
                        >
                          <span className="mr-2">❌</span>
                          Reject Job
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Update Actions - Only for active jobs */}
                  {filter === "active" &&
                    job.status !== "assigned" &&
                    job.status !== "delivered" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Update Delivery Status
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.status === "accepted" && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "arrived")
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              🏠 Mark Arrived at Pickup
                            </button>
                          )}
                          {(job.status === "accepted" ||
                            job.status === "arrived") && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "picked-up")
                              }
                              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm"
                            >
                              📦 Mark Package Picked
                            </button>
                          )}
                          {job.status === "picked-up" && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "on-the-way")
                              }
                              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm"
                            >
                              🚚 Mark On the Way
                            </button>
                          )}
                          {(job.status === "picked-up" ||
                            job.status === "on-the-way") && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "delivered")
                              }
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                              ✅ Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  {/* ✅ Delivery Completed Message for Completed Jobs */}
                  {job.status === "delivered" && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <span className="text-lg mr-2">✅</span>
                        Delivery Completed
                      </h4>
                      <p className="text-green-700">
                        This job was successfully delivered on{" "}
                        {job.deliveredAt
                          ? new Date(job.deliveredAt).toLocaleString()
                          : "recently"}
                        .
                      </p>
                    </div>
                  )}

                  {/* Customer Contact */}
                  {job.customer && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Customer Contact
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-blue-700 font-medium">
                            {job.customer.name}
                          </p>
                          <p className="text-blue-600">{job.customer.phone}</p>
                          <p className="text-blue-500 text-sm">
                            {job.customer.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${job.customer.phone}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            📞 Call
                          </a>
                          <a
                            href={`sms:${job.customer.phone}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            💬 SMS
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">
                {filter === "active" ? "📭" : "✅"}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === "active" ? "No Active Jobs" : "No Completed Jobs"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "active"
                  ? "You don't have any active delivery jobs at the moment."
                  : "You haven't completed any delivery jobs yet."}
              </p>
              {filter === "active" && (
                <a
                  href="/driver/jobs"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Find Available Jobs
                </a>
              )}
            </div>
          )}

          {/* Auto-refresh Indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Real-time updates active
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyJobs;
