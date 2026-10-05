import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

export default function DriverOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const socket = io("http://localhost:5000"); // Backend URL

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen to real-time order updates
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prevOrders) => {
        const index = prevOrders.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          const newOrders = [...prevOrders];
          newOrders[index] = updatedOrder;
          return newOrders;
        } else {
          return [updatedOrder, ...prevOrders];
        }
      });
    });

    return () => socket.disconnect();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${orderId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept job");
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.post(
        `https://pick4u-yyco.onrender.com/api/driver/jobs/${orderId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject job");
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
        label: "Pending",
      },
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
      styles[status] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
        label: status,
      }
    );
  };

  const filterTabs = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "assigned",
      label: "New Requests",
      count: orders.filter((o) => o.status === "assigned").length,
    },
    {
      value: "accepted",
      label: "Accepted",
      count: orders.filter((o) => o.status === "accepted").length,
    },
    {
      value: "in-transit",
      label: "In Transit",
      count: orders.filter((o) => o.status === "in-transit").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center mt-10">No orders available</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-transparent hover:border-blue-600 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {statusStyle.icon} {statusStyle.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <p>📍 Pickup: {order.pickupAddress}</p>
                  <p>📍 Drop: {order.dropAddress}</p>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <p>⚖️ Weight: {order.packageWeight} kg</p>
                  <p>🚀 Type: {order.deliveryType}</p>
                  <p>💰 Fare: ₹{order.fare}</p>
                  {order.customer && <p>👤 Customer: {order.customer.name}</p>}
                </div>

                <div className="flex gap-3">
                  {order.status === "assigned" && (
                    <>
                      <button
                        onClick={() => handleAccept(order._id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(order._id)}
                        className="flex-1 border-2 border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(order.status === "accepted" ||
                    order.status === "in-transit") && (
                    <Link
                      to={`/driver/jobs/${order._id}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-center hover:bg-blue-700 transition-all"
                    >
                      Update Status
                    </Link>
                  )}
                  {order.status === "delivered" && (
                    <button
                      disabled
                      className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg font-semibold cursor-not-allowed"
                    >
                      ✅ Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
