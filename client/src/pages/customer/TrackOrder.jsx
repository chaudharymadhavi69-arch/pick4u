import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";

import axios from "axios";

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);

  useEffect(() => {
    fetchOrderDetails();

    // Socket listeners for real-time updates
    if (socket) {
      socket.on("order-accepted", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Driver accepted your order!", "success");
          fetchOrderDetails(); // Refresh order data
        }
      });

      socket.on("driver-assigned", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Driver assigned to your order!", "success");
          fetchOrderDetails();
        }
      });

      socket.on("order-arrived", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Driver arrived at pickup location!", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-picked", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Package picked up by driver!", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-on-the-way", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Driver is on the way to delivery!", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-delivered", (data) => {
        if (data._id === id) {
          addRealTimeUpdate("Package delivered successfully!", "success");
          fetchOrderDetails();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("order-accepted");
        socket.off("driver-assigned");
        socket.off("order-arrived");
        socket.off("order-picked");
        socket.off("order-on-the-way");
        socket.off("order-delivered");
      }
    };
  }, [socket, id]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://pick4u-yyco.onrender.com/api/customer/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const addRealTimeUpdate = (message, type) => {
    setRealTimeUpdates((prev) => [
      {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "arrived":
        return "bg-purple-100 text-purple-800";
      case "picked-up":
        return "bg-indigo-100 text-indigo-800";
      case "on-the-way":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "accepted":
        return "✅";
      case "arrived":
        return "📍";
      case "picked-up":
        return "📦";
      case "on-the-way":
        return "🚚";
      case "delivered":
        return "🎉";
      default:
        return "📋";
    }
  };

  const statusSteps = [
    {
      status: "pending",
      label: "Order Placed",
      description: "Your order has been placed",
    },
    {
      status: "assigned",
      label: "Driver Assigned",
      description: "Driver is assigned to your order",
    },
    {
      status: "accepted",
      label: "Order Accepted",
      description: "Driver has accepted your order",
    },
    {
      status: "arrived",
      label: "Arrived at Pickup",
      description: "Driver arrived at pickup location",
    },
    {
      status: "picked-up",
      label: "Package Picked",
      description: "Driver picked up your package",
    },
    {
      status: "on-the-way",
      label: "On the Way",
      description: "Driver is on the way to delivery",
    },
    {
      status: "delivered",
      label: "Delivered",
      description: "Package delivered successfully",
    },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order?.status
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h2>
            <button
              onClick={() => navigate("/customer/orders")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Track Order</h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
            </div>
            <button
              onClick={() => navigate("/customer/orders")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tracking */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Current Status
                  </h2>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)} {order.status?.toUpperCase()}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.status} className="flex items-start">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          index < currentStepIndex
                            ? "bg-green-500 border-green-500 text-white"
                            : index === currentStepIndex
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {index < currentStepIndex ? "✓" : index + 1}
                      </div>

                      <div className="ml-4 flex-1">
                        <p
                          className={`font-semibold ${
                            index <= currentStepIndex
                              ? "text-gray-800"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>

                        {index === currentStepIndex &&
                          order.status !== "delivered" && (
                            <p className="text-sm text-blue-600 mt-1">
                              Current Step
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Pickup Address
                    </h4>
                    <p className="text-gray-800">{order.pickupAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-gray-800">{order.dropAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Package Details
                    </h4>
                    <p className="text-gray-800">
                      {order.packageWeight} kg • {order.deliveryType}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Total Fare
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{order.fare}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Driver Info */}
              {order.assignedDriver && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Driver Information
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl">
                      {order.assignedDriver.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.assignedDriver.name}
                      </p>
                      <p className="text-gray-600">
                        {order.assignedDriver.phone}
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                    📞 Call Driver
                  </button>
                </div>
              )}

              {/* Real-time Updates */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Live Updates
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {realTimeUpdates.length > 0 ? (
                    realTimeUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <span
                          className={`text-lg ${
                            update.type === "success"
                              ? "text-green-500"
                              : "text-blue-500"
                          }`}
                        >
                          {update.type === "success" ? "✅" : "ℹ️"}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {update.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {update.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Waiting for updates...
                    </p>
                  )}
                </div>
              </div>

              {/* Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Need Help?
                </h3>
                <p className="text-blue-700 mb-4">
                  Contact support for any issues with your delivery.
                </p>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>📞 +91 9876543210</p>
                  <p>📧 support@pick4u.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackOrder;
