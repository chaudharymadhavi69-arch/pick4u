import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

const CustomerOrderTracking = () => {
  const { orderId } = useParams();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [statusSteps, setStatusSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchOrderStatus();

    // Set up real-time updates
    const interval = setInterval(fetchOrderStatus, 10000);

    // Socket events for real-time updates
    if (socket) {
      socket.on("order-accepted", (data) => {
        if (data.order._id === orderId) {
          fetchOrderStatus();
          showNotification("Driver accepted your order!");
        }
      });

      socket.on("order-arrived", (data) => {
        if (data.order._id === orderId) {
          fetchOrderStatus();
          showNotification("Driver arrived at pickup location!");
        }
      });

      socket.on("order-picked", (data) => {
        if (data.order._id === orderId) {
          fetchOrderStatus();
          showNotification("Driver picked up your package!");
        }
      });

      socket.on("order-on-the-way", (data) => {
        if (data.order._id === orderId) {
          fetchOrderStatus();
          showNotification("Driver is on the way to you!");
        }
      });

      socket.on("order-delivered", (data) => {
        if (data.order._id === orderId) {
          fetchOrderStatus();
          showNotification("Package delivered successfully! 🎉");
        }
      });
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off("order-accepted");
        socket.off("order-arrived");
        socket.off("order-picked");
        socket.off("order-on-the-way");
        socket.off("order-delivered");
      }
    };
  }, [orderId, socket]);

  const fetchOrderStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://pick4u-yyco.onrender.com/api/customer/orders/${orderId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);
        setStatusSteps(response.data.statusSteps);
        setLastUpdated(new Date().toLocaleTimeString());
        setError("");
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
      setError("Failed to load order status");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    // You can use a proper notification library here
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Delivery Update", { body: message });
    }
    // Fallback to browser alert
    // alert(message);
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order status...</p>
          <p className="text-gray-500 text-sm mt-2">Tracking your delivery</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Order
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchOrderStatus}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <Link
              to="/customer/orders"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link
            to="/customer/orders"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep =
    statusSteps.find((step) => step.step === order.currentStep) ||
    statusSteps[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  Order Tracking
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status === "delivered"
                    ? "Delivered"
                    : order.status === "cancelled"
                    ? "Cancelled"
                    : "In Progress"}
                </span>
              </div>
              <p className="text-gray-600">Order ID: {order.orderId}</p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                🔔 Enable Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Current Status Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Current Status</h2>
              <p className="text-blue-100">{currentStep.description}</p>
            </div>
            <div className="text-4xl">{currentStep.icon}</div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Delivery Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">📦</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pickup Location</p>
                  <p className="font-medium text-gray-800">
                    {order.pickupAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm">🏠</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Location</p>
                  <p className="font-medium text-gray-800">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 text-sm">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Fare</p>
                  <p className="font-medium text-green-600">₹{order.fare}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          {order.assignedDriver && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Driver Information
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {order.assignedDriver.name?.charAt(0) || "D"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {order.assignedDriver.name}
                  </p>
                  <p className="text-gray-600">{order.assignedDriver.phone}</p>
                  {order.assignedDriver.vehicleType && (
                    <p className="text-sm text-gray-500">
                      {order.assignedDriver.vehicleType}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Your driver is on the way. You can contact them directly if
                  needed.
                </p>
              </div>
            </div>
          )}

          {/* Live Tracking */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              Live Tracking
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className="font-medium capitalize text-gray-800">
                  {order.status.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Step</span>
                <span className="font-medium text-blue-600">
                  {currentStep.title}
                </span>
              </div>
              {order.estimatedDelivery && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Est. Delivery</span>
                  <span className="font-medium text-green-600">
                    {new Date(order.estimatedDelivery).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-600 font-medium">
                Live updating
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Delivery Progress
          </h3>

          <div className="relative">
            {statusSteps.map((step, index) => (
              <div
                key={step.step}
                className="flex items-start space-x-4 mb-8 last:mb-0"
              >
                {/* Step Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    step.completed
                      ? "bg-green-500 text-white shadow-green-200"
                      : step.step === order.currentStep
                      ? "bg-blue-500 text-white shadow-blue-200 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-xl">{step.icon}</span>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className={`font-semibold text-lg ${
                        step.completed || step.step === order.currentStep
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.step === order.currentStep && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                        Current Step
                      </span>
                    )}
                    {step.completed && step.step !== order.currentStep && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                        Completed
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-lg ${
                      step.completed || step.step === order.currentStep
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>

                  {step.timestamp && (
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-7 top-14 w-0.5 h-16 ${
                      step.completed ? "bg-green-300" : "bg-gray-200"
                    }`}
                    style={{ marginLeft: "28px" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Proof Photo */}
        {order.proofPhoto && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Proof
            </h3>
            <div className="text-center">
              <img
                src={order.proofPhoto}
                alt="Delivery proof"
                className="rounded-lg max-w-md mx-auto shadow-lg"
              />
              <p className="text-center text-gray-500 mt-3">
                Photo taken at delivery location
              </p>
            </div>
          </div>
        )}

        {/* Support & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <span className="text-blue-600 text-2xl">💬</span>
              <div>
                <h4 className="font-semibold text-blue-800 text-lg mb-2">
                  Need Help?
                </h4>
                <p className="text-blue-700 mb-4">
                  Our support team is here to help you with any questions about
                  your delivery
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📞</span>
                    <span className="text-blue-700">+91 1800-123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">✉️</span>
                    <span className="text-blue-700">support@pick4u.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <span className="text-green-600 text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-green-800 text-lg mb-2">
                  Quick Actions
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={fetchOrderStatus}
                    className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    🔄 Refresh Status
                  </button>
                  <Link
                    to="/customer/orders"
                    className="block w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center border border-green-200"
                  >
                    📋 View All Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-600">
              Auto-refreshing every 10 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderTracking;
