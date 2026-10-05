import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, in-transit, delivered, cancelled

  const API_URL = "https://pick4u-yyco.onrender.com/api/customer"; // backend base URL

  // ✅ Get token from localStorage or wherever you store it
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err.response || err);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      assigned: { bg: "bg-purple-100", text: "text-purple-800", icon: "📝" },
      accepted: { bg: "bg-blue-100", text: "text-blue-800", icon: "👍" },
      rejected: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
      picked: { bg: "bg-indigo-100", text: "text-indigo-800", icon: "📦" },
      "in-transit": { bg: "bg-blue-100", text: "text-blue-800", icon: "🚚" },
      delivered: { bg: "bg-green-100", text: "text-green-800", icon: "✅" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", icon: "❌" },
    };
    return (
      styles[status.toLowerCase()] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: "📦",
      }
    );
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === filter);

  const stats = {
    all: orders.length,
    pending: orders.filter((o) => o.status.toLowerCase() === "pending").length,
    assigned: orders.filter((o) => o.status.toLowerCase() === "assigned")
      .length,
    accepted: orders.filter((o) => o.status.toLowerCase() === "accepted")
      .length,
    "in-transit": orders.filter((o) => o.status.toLowerCase() === "in-transit")
      .length,
    delivered: orders.filter((o) => o.status.toLowerCase() === "delivered")
      .length,
    cancelled: orders.filter((o) => o.status.toLowerCase() === "cancelled")
      .length,
  };

  const filterTabs = [
    { value: "all", label: "All Orders", icon: "📦", count: stats.all },
    { value: "pending", label: "Pending", icon: "⏳", count: stats.pending },
    { value: "assigned", label: "Assigned", icon: "📝", count: stats.assigned },
    { value: "accepted", label: "Accepted", icon: "👍", count: stats.accepted },
    {
      value: "in-transit",
      label: "In Transit",
      icon: "🚚",
      count: stats["in-transit"],
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: "✅",
      count: stats.delivered,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: "❌",
      count: stats.cancelled,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">📦 My Orders</h1>
              <p className="text-gray-200">
                Track and manage all your deliveries
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Total Orders</p>
              <p className="text-4xl font-bold">{orders.length}</p>
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
                <span className="text-lg">{tab.icon}</span>
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

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 font-medium">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === "all" ? "No orders yet" : `No ${filter} orders`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "Start booking deliveries to see them here"
                : `You don't have any ${filter} orders at the moment`}
            </p>
            {filter === "all" && (
              <Link
                to="/customer/book"
                className="inline-flex items-center gap-2 bg-[#0500FF] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0400cc] transition-all"
              >
                <span>📦</span> Book Your First Order
              </Link>
            )}
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-[#0500FF] hover:underline font-semibold"
              >
                View All Orders
              </button>
            )}
          </div>
        )}

        {/* Orders List */}
        {!loading &&
          filteredOrders.length > 0 &&
          filteredOrders.map((order) => {
            const statusStyle = getStatusStyle(order.status);
            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-[#0500FF] mb-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        {statusStyle.icon} {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/customer/orders/${order._id}`}
                      className="px-5 py-2 bg-[#0500FF] text-white rounded-lg font-semibold hover:bg-[#0400cc] transition-all flex items-center gap-2"
                    >
                      <span>📋</span> View Details
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Pickup */}
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl">📍</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        Pickup Location
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {order.pickupAddress}
                      </p>
                    </div>
                  </div>

                  {/* Drop */}
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl">📍</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        Drop Location
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {order.dropAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="flex flex-wrap gap-6 text-sm pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⚖️</span>
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-semibold text-gray-800">
                      {order.packageWeight} kg
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🚀</span>
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {order.deliveryType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💰</span>
                    <span className="text-gray-600">Fare:</span>
                    <span className="font-bold text-[#0500FF] text-lg">
                      ₹{order.fare}
                    </span>
                  </div>
                  {order.assignedDriver && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">👤</span>
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-semibold text-gray-800">
                        {order.assignedDriver.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
