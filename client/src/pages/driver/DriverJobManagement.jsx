import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

const DriverJobManagement = () => {
  const socket = useSocket();
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextActions, setNextActions] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCurrentJob();

    // Real-time updates every 15 seconds
    const interval = setInterval(fetchCurrentJob, 15000);

    // Socket events for order updates
    if (socket) {
      socket.on("order-assigned", (data) => {
        if (data.driverId === localStorage.getItem("userId")) {
          fetchCurrentJob();
        }
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off("order-assigned");
      }
    };
  }, [socket]);

  const fetchCurrentJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/current-job",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCurrentJob(response.data.job);
        setNextActions(response.data.nextActions || []);
      }
    } catch (error) {
      console.error("Error fetching current job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (action, jobId) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      let endpoint = "";

      switch (action) {
        case "mark-arrived":
          endpoint = "arrived";
          break;
        case "mark-picked-up":
          endpoint = "picked-up";
          break;
        case "mark-on-the-way":
          endpoint = "on-the-way";
          break;
        case "mark-delivered":
          endpoint = "delivered";
          break;
        default:
          return;
      }

      await axios.put(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${jobId}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message
      const actionMessages = {
        "mark-arrived": "Arrived at pickup location!",
        "mark-picked-up": "Package picked up successfully!",
        "mark-on-the-way": "On the way to delivery!",
        "mark-delivered": "Delivery completed successfully! 🎉",
      };

      alert(`✅ ${actionMessages[action]}`);
      fetchCurrentJob(); // Refresh data
    } catch (error) {
      console.error(`Error updating status:`, error);
      alert(`❌ ${error.response?.data?.message || "Error updating status"}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadProof = async (jobId) => {
    // Implement photo upload functionality
    alert("📸 Photo upload feature would open here");
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: "blue",
      arrived: "purple",
      "picked-up": "yellow",
      "on-the-way": "orange",
      delivered: "green",
    };
    return colors[status] || "gray";
  };

  const getStatusIcon = (status) => {
    const icons = {
      accepted: "✅",
      arrived: "📍",
      "picked-up": "📦",
      "on-the-way": "🚗",
      delivered: "🎉",
    };
    return icons[status] || "📋";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading current job...</p>
          <p className="text-gray-500 text-sm mt-2">
            Checking for active deliveries
          </p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Active Job
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any active delivery jobs at the moment.
          </p>
          <div className="space-y-3">
            <Link
              to="/driver/jobs"
              className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Find Available Jobs
            </Link>
            <Link
              to="/driver/profile"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Current Delivery
              </h1>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-2 rounded-full font-medium text-white bg-${getStatusColor(
                    currentJob.status
                  )}-500`}
                >
                  {getStatusIcon(currentJob.status)}{" "}
                  {currentJob.status.replace("-", " ").toUpperCase()}
                </span>
                <span className="text-gray-600">
                  Order #{currentJob._id.slice(-6)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Active Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Route Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Delivery Route
            </h3>
            <div className="space-y-6">
              {/* Pickup Location */}
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    PICKUP LOCATION
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {currentJob.pickupAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Collect the package from here
                  </p>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">B</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    DELIVERY LOCATION
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {currentJob.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Deliver the package here
                  </p>
                </div>
              </div>

              {/* Route Map Placeholder */}
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-gray-600">
                  Live route map would appear here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Integration with maps service
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Actions Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Customer Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">
                      {currentJob.customer.name?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {currentJob.customer.name}
                    </p>
                    <p className="text-gray-600">{currentJob.customer.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500">Fare</p>
                    <p className="font-semibold text-green-600">
                      ₹{currentJob.fare}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500">Contact</p>
                    <p className="font-semibold text-blue-600">Call</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-700">
                    💡 Remember to confirm package condition with customer
                  </p>
                </div>
              </div>
            </div>

            {/* Next Actions */}
            {nextActions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Next Actions
                </h3>
                <div className="space-y-3">
                  {nextActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        action.action === "upload-proof"
                          ? handleUploadProof(currentJob._id)
                          : handleStatusUpdate(action.action, currentJob._id)
                      }
                      disabled={updating}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                        {updating && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Delivery Timeline
          </h3>
          <div className="space-y-3">
            {currentJob.acceptedAt && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="text-gray-700">Order Accepted</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(currentJob.acceptedAt).toLocaleString()}
                </span>
              </div>
            )}
            {currentJob.arrivedAt && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xl">📍</span>
                  <span className="text-gray-700">Arrived at Pickup</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(currentJob.arrivedAt).toLocaleString()}
                </span>
              </div>
            )}
            {currentJob.pickedUpAt && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-500 text-xl">📦</span>
                  <span className="text-gray-700">Package Picked Up</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(currentJob.pickedUpAt).toLocaleString()}
                </span>
              </div>
            )}
            {currentJob.onTheWayAt && (
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <span className="text-orange-500 text-xl">🚗</span>
                  <span className="text-gray-700">On the Way to Delivery</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(currentJob.onTheWayAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={fetchCurrentJob}
            className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🔄</div>
            <p className="font-medium text-gray-800">Refresh</p>
          </button>

          <Link
            to="/driver/jobs"
            className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="font-medium text-gray-800">Find Jobs</p>
          </Link>

          <button
            onClick={() => alert("Emergency contact would dial here")}
            className="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-center"
          >
            <div className="text-2xl mb-2">🚨</div>
            <p className="font-medium text-red-700">Emergency</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverJobManagement;
