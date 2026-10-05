import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import axios from "axios";

const AdminOrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Driver assignment state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();

    // Socket listeners for real-time updates
    if (socket) {
      socket.on("order-accepted", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate(
            `Driver ${data.driver.name} accepted the order`,
            "success"
          );
          fetchOrderDetails();
        }
      });

      socket.on("order-assigned", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate(`Driver assigned - waiting for acceptance`, "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-arrived", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate("Driver arrived at pickup location", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-picked", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate("Driver picked up the package", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-on-the-way", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate("Driver is on the way to delivery", "info");
          fetchOrderDetails();
        }
      });

      socket.on("order-delivered", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate("Package delivered successfully!", "success");
          fetchOrderDetails();
        }
      });

      socket.on("order-cancelled", (data) => {
        if (data.order._id === orderId) {
          addRealTimeUpdate(
            `Order cancelled by ${data.cancelledBy}`,
            "warning"
          );
          fetchOrderDetails();
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("order-accepted");
        socket.off("order-assigned");
        socket.off("order-arrived");
        socket.off("order-picked");
        socket.off("order-on-the-way");
        socket.off("order-delivered");
        socket.off("order-cancelled");
      }
    };
  }, [socket, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      console.log("🔄 Admin fetching order:", orderId);

      const response = await axios.get(
        `https://pick4u-yyco.onrender.com/api/admin/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Admin order API response:", response.data);

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || "Failed to load order");
      }
    } catch (error) {
      console.error("❌ Error fetching order details:", error);
      setError(error.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available drivers
  const fetchAvailableDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/drivers",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter available and approved drivers
      const available = response.data.filter(
        (driver) =>
          driver.availability &&
          driver.kycStatus === "APPROVED" &&
          !driver.user?.isBlocked
      );

      setAvailableDrivers(available);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Error loading available drivers");
    }
  };

  // Open assign driver modal
  const openAssignModal = async () => {
    setShowAssignModal(true);
    await fetchAvailableDrivers();
  };

  // Assign driver to order
  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    try {
      setAssignLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `https://pick4u-yyco.onrender.com/api/admin/orders/${orderId}/assign-driver`,
        { driverId: selectedDriver },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Driver assigned successfully! Waiting for driver acceptance.");
      setShowAssignModal(false);
      setSelectedDriver("");
      fetchOrderDetails();
    } catch (error) {
      alert(
        "Error assigning driver: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setAssignLoading(false);
    }
  };

  // Debug function to check what's happening
  const debugCheckOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://pick4u-yyco.onrender.com/api/admin/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("🔍 DEBUG - Raw API response:", response.data);
      alert(`DEBUG Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error("DEBUG Error:", error);
      alert(`DEBUG Error: ${error.response?.data?.message || error.message}`);
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

  const cancelOrder = async (reason) => {
    if (!reason) {
      reason = prompt("Please enter cancellation reason:");
      if (!reason) return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/orders/${orderId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order cancelled successfully!");
      fetchOrderDetails();
    } catch (error) {
      alert(
        "Error cancelling order: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      assigned: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      arrived: "bg-purple-100 text-purple-800 border-purple-200",
      "picked-up": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "on-the-way": "bg-orange-100 text-orange-800 border-orange-200",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      assigned: "👨‍💼",
      accepted: "✅",
      arrived: "📍",
      "picked-up": "📦",
      "on-the-way": "🚗",
      delivered: "🎉",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const statusSteps = [
    {
      step: 1,
      status: "pending",
      title: "Order Placed",
      description: "Customer placed the order",
      icon: "📦",
    },
    {
      step: 2,
      status: "assigned",
      title: "Driver Assigned",
      description: "Driver assigned to the order",
      icon: "👨‍💼",
    },
    {
      step: 3,
      status: "accepted",
      title: "Order Accepted",
      description: "Driver accepted the order",
      icon: "✅",
    },
    {
      step: 4,
      status: "arrived",
      title: "Arrived at Pickup",
      description: "Driver arrived at pickup location",
      icon: "📍",
    },
    {
      step: 5,
      status: "picked-up",
      title: "Package Picked",
      description: "Driver picked up the package",
      icon: "📬",
    },
    {
      step: 6,
      status: "on-the-way",
      title: "On the Way",
      description: "Driver is on the way to delivery",
      icon: "🚗",
    },
    {
      step: 7,
      status: "delivered",
      title: "Delivered",
      description: "Package delivered successfully",
      icon: "🎉",
    },
  ];

  const currentStep =
    statusSteps.find((step) => step.status === order?.status) || statusSteps[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4 text-red-500">❌</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {error || "Order Not Found"}
          </h3>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or cannot be loaded.
          </p>
          <div className="space-y-3">
            <button
              onClick={fetchOrderDetails}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={debugCheckOrder}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔍 Debug Check
            </button>
            <Link
              to="/admin/orders"
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  Order Tracking
                </h1>
                <span
                  className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(
                    order?.status
                  )}`}
                >
                  {getStatusIcon(order?.status)} {order?.status?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Order ID:</span>
                  <p className="font-mono font-medium">
                    {order?.orderId || order?._id}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <p className="font-medium">
                    {order?.customer?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Fare:</span>
                  <p className="font-bold text-green-600">₹{order?.fare}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {/* Assign Driver Button - Show only for pending orders without driver */}
              {order?.status === "pending" && !order?.assignedDriver && (
                <button
                  onClick={openAssignModal}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  👨‍💼 Assign Driver
                </button>
              )}

              {/* Reassign Driver Button - Show for assigned orders waiting for acceptance */}
              {order?.status === "assigned" && order?.assignedDriver && (
                <button
                  onClick={openAssignModal}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔄 Reassign Driver
                </button>
              )}

              <button
                onClick={debugCheckOrder}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🔍 Debug
              </button>

              <Link
                to="/admin/orders"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Orders
              </Link>

              {order?.status !== "delivered" &&
                order?.status !== "cancelled" && (
                  <button
                    onClick={() => cancelOrder()}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {actionLoading ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="xl:col-span-3 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Delivery Progress
              </h2>

              <div className="relative">
                {statusSteps.map((step, index) => (
                  <div
                    key={step.step}
                    className="flex items-start space-x-4 mb-8 last:mb-0"
                  >
                    {/* Step Icon */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${
                        step.status === order.status
                          ? "bg-blue-500 text-white border-blue-500 shadow-blue-200 animate-pulse"
                          : statusSteps.findIndex(
                              (s) => s.status === order.status
                            ) > index
                          ? "bg-green-500 text-white border-green-500 shadow-green-200"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      }`}
                    >
                      <span className="text-xl">{step.icon}</span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4
                          className={`font-semibold text-lg ${
                            step.status === order.status ||
                            statusSteps.findIndex(
                              (s) => s.status === order.status
                            ) > index
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.status === order.status && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                            Current Step
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-lg ${
                          step.status === order.status ||
                          statusSteps.findIndex(
                            (s) => s.status === order.status
                          ) > index
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>

                      {/* Timestamps */}
                      {step.status === "accepted" && order.acceptedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Accepted:{" "}
                          {new Date(order.acceptedAt).toLocaleString()}
                        </p>
                      )}
                      {step.status === "arrived" && order.arrivedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Arrived: {new Date(order.arrivedAt).toLocaleString()}
                        </p>
                      )}
                      {step.status === "picked-up" && order.pickedUpAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Picked: {new Date(order.pickedUpAt).toLocaleString()}
                        </p>
                      )}
                      {step.status === "on-the-way" && order.onTheWayAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          On Way: {new Date(order.onTheWayAt).toLocaleString()}
                        </p>
                      )}
                      {step.status === "delivered" && order.deliveredAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Delivered:{" "}
                          {new Date(order.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-7 top-14 w-0.5 h-16 ${
                          statusSteps.findIndex(
                            (s) => s.status === order.status
                          ) > index
                            ? "bg-green-300"
                            : "bg-gray-200"
                        }`}
                        style={{ marginLeft: "28px" }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Pickup Address
                    </label>
                    <p className="font-medium text-gray-800">
                      {order.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Delivery Address
                    </label>
                    <p className="font-medium text-gray-800">
                      {order.dropAddress}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">
                        Package Weight
                      </label>
                      <p className="font-medium text-gray-800">
                        {order.packageWeight} kg
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        Delivery Type
                      </label>
                      <p className="font-medium text-gray-800 capitalize">
                        {order.deliveryType}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Order Created
                    </label>
                    <p className="font-medium text-gray-800">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Customer Information
                </h3>
                {order.customer ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {order.customer.name?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {order.customer.name}
                        </p>
                        <p className="text-gray-600">{order.customer.phone}</p>
                        <p className="text-gray-500 text-sm">
                          {order.customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-center hover:bg-green-700 transition-colors text-sm"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-center hover:bg-blue-700 transition-colors text-sm"
                      >
                        ✉️ Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No customer information available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Driver Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Driver Information
              </h3>
              {order.assignedDriver ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">
                        {order.assignedDriver.name?.charAt(0) || "D"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.assignedDriver.name}
                      </p>
                      <p className="text-gray-600">
                        {order.assignedDriver.phone}
                      </p>
                      {order.assignedDriver.vehicleType && (
                        <p className="text-gray-500 text-sm">
                          {order.assignedDriver.vehicleType}
                        </p>
                      )}
                      <p
                        className={`text-sm ${
                          order.status === "assigned"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        Status:{" "}
                        {order.status === "assigned"
                          ? "🟡 Waiting for Acceptance"
                          : "✅ Accepted"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${order.assignedDriver.phone}`}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-center hover:bg-green-700 transition-colors text-sm"
                    >
                      📞 Call Driver
                    </a>
                    {order.status === "assigned" && (
                      <button
                        onClick={openAssignModal}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-center hover:bg-blue-700 transition-colors text-sm"
                      >
                        🔄 Reassign
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🚗</div>
                  <p className="text-gray-500 mb-4">
                    No driver assigned to this order
                  </p>
                  <button
                    onClick={openAssignModal}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    👨‍💼 Assign a Driver
                  </button>
                </div>
              )}
            </div>

            {/* Real-time Updates */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Live Updates
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {realTimeUpdates.length > 0 ? (
                  realTimeUpdates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-3 rounded-lg border ${
                        update.type === "success"
                          ? "bg-green-50 border-green-200"
                          : update.type === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <span
                          className={`text-lg ${
                            update.type === "success"
                              ? "text-green-500"
                              : update.type === "warning"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        >
                          {update.type === "success"
                            ? "✅"
                            : update.type === "warning"
                            ? "⚠️"
                            : "ℹ️"}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-medium">
                            {update.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {update.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📡</div>
                    <p className="text-gray-500 text-sm">
                      Waiting for live updates...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={fetchOrderDetails}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  🔄 Refresh Status
                </button>
                <Link
                  to={`/admin/orders/${orderId}/edit`}
                  className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium text-center"
                >
                  ✏️ Edit Order
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  🖨️ Print Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assign Driver Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Assign Driver to Order
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Available Driver
                  </label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a driver</option>
                    {availableDrivers.map((driver) => (
                      <option key={driver._id} value={driver.user?._id}>
                        {driver.user?.name} - {driver.user?.phone}
                        {driver.vehicleType ? ` (${driver.vehicleType})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {availableDrivers.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <p className="text-yellow-700 text-sm">
                      No available drivers. All approved drivers are busy or
                      offline.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedDriver("");
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignDriver}
                    disabled={!selectedDriver || assignLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {assignLoading ? "Assigning..." : "Assign Driver"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderTracking;
