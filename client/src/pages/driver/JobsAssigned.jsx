import React, { useEffect, useState } from "react";
import { getAssignedJobs, acceptJob, rejectJob } from "../../api";
import { Link } from "react-router-dom";

export default function JobsAssigned() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Dummy data
  const dummyJobs = [
    {
      _id: "job123456",
      pickupAddress: "Connaught Place, New Delhi",
      dropAddress: "Karol Bagh, New Delhi",
      packageWeight: 5,
      deliveryType: "same-day",
      fare: 250,
      status: "assigned",
      createdAt: new Date().toISOString(),
      customer: { name: "Amit Sharma", phone: "+91 98765 43210" },
    },
    {
      _id: "job123457",
      pickupAddress: "Rajouri Garden, Delhi",
      dropAddress: "Dwarka Sector 10, Delhi",
      packageWeight: 3,
      deliveryType: "instant",
      fare: 180,
      status: "assigned",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      customer: { name: "Priya Singh", phone: "+91 98765 43211" },
    },
    {
      _id: "job123458",
      pickupAddress: "Lajpat Nagar Market",
      dropAddress: "Greater Kailash, Delhi",
      packageWeight: 2,
      deliveryType: "same-day",
      fare: 150,
      status: "accepted",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      customer: { name: "Rahul Verma", phone: "+91 98765 43212" },
    },
    {
      _id: "job123459",
      pickupAddress: "Nehru Place, Delhi",
      dropAddress: "Noida Sector 62",
      packageWeight: 8,
      deliveryType: "instant",
      fare: 350,
      status: "in-transit",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      customer: { name: "Sneha Gupta", phone: "+91 98765 43213" },
    },
    {
      _id: "job123460",
      pickupAddress: "Saket, South Delhi",
      dropAddress: "Vasant Kunj, Delhi",
      packageWeight: 4,
      deliveryType: "same-day",
      fare: 200,
      status: "delivered",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      customer: { name: "Vikram Malhotra", phone: "+91 98765 43214" },
    },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAssignedJobs();
      setJobs(res.data);
    } catch (err) {
      console.log("Using dummy data:", err);
      setJobs(dummyJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (jobId) => {
    try {
      await acceptJob(jobId);
      fetchJobs();
    } catch (err) {
      console.error("Error accepting job:", err);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: "accepted" } : j))
      );
    }
  };

  const handleReject = async (jobId) => {
    try {
      await rejectJob(jobId);
      fetchJobs();
    } catch (err) {
      console.error("Error rejecting job:", err);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      assigned: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: "🔵",
        label: "New",
      },
      accepted: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: "⏳",
        label: "Accepted",
      },
      "in-transit": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        icon: "🚚",
        label: "In Transit",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: "✅",
        label: "Delivered",
      },
    };
    return (
      styles[status.toLowerCase()] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
        label: status,
      }
    );
  };

  const filterTabs = [
    { value: "all", label: "All Jobs", count: jobs.length },
    {
      value: "assigned",
      label: "New Requests",
      count: jobs.filter((j) => j.status === "assigned").length,
    },
    {
      value: "accepted",
      label: "Accepted",
      count: jobs.filter((j) => j.status === "accepted").length,
    },
    {
      value: "in-transit",
      label: "In Transit",
      count: jobs.filter((j) => j.status === "in-transit").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: jobs.filter((j) => j.status === "delivered").length,
    },
  ];

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin mx-auto mb-4 text-[#0500FF]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-gray-500 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">📋 All Jobs</h1>
              <p className="text-gray-200">
                Manage and track your delivery assignments
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Total Jobs</p>
              <p className="text-4xl font-bold">{jobs.length}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  filter === tab.value
                    ? "bg-[#0500FF] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.value
                      ? "bg-white text-[#0500FF]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "New jobs will appear here when assigned"
                : `You don't have any ${filter} jobs at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const statusStyle = getStatusStyle(job.status);
              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-[#0500FF]"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Order #{job._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.icon} {statusStyle.label}
                    </span>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Pickup Location
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {job.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Drop Location
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {job.dropAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap gap-6 text-sm mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">⚖️</span>
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-semibold text-gray-800">
                        {job.packageWeight} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🚀</span>
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-800 capitalize">
                        {job.deliveryType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">💰</span>
                      <span className="text-gray-600">Fare:</span>
                      <span className="font-bold text-[#0500FF] text-lg">
                        ₹{job.fare}
                      </span>
                    </div>
                    {job.customer && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">👤</span>
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-semibold text-gray-800">
                          {job.customer.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {job.status === "assigned" && (
                      <>
                        <button
                          onClick={() => handleAccept(job._id)}
                          className="flex-1 bg-[#0500FF] text-white py-3 rounded-lg font-semibold hover:bg-[#0400cc] transition-all shadow-md"
                        >
                          Accept Job
                        </button>
                        <button
                          onClick={() => handleReject(job._id)}
                          className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(job.status === "accepted" ||
                      job.status === "in-transit") && (
                      <Link
                        to={`/driver/jobs/${job._id}`}
                        className="flex-1 bg-[#0500FF] text-white py-3 rounded-lg font-semibold hover:bg-[#0400cc] transition-all text-center shadow-md"
                      >
                        Update Status
                      </Link>
                    )}
                    {job.status === "delivered" && (
                      <button
                        disabled
                        className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                      >
                        ✅ Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
