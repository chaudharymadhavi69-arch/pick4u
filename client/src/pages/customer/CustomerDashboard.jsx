import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/customer/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orders = response.data.slice(0, 5);
      setRecentOrders(orders);

      setStats({
        totalOrders: response.data.length,
        pendingOrders: response.data.filter(
          (order) => order.status === "pending"
        ).length,
        deliveredOrders: response.data.filter(
          (order) => order.status === "delivered"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E3E3E3] flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section with Hero Banner */}
          <div className="mb-8 bg-gradient-to-r from-[#0500FF] to-[#000000] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1
                  className="text-4xl font-black text-white mb-3"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Welcome back,{" "}
                  <span className="text-[#18CFFF]">{user?.name}</span>!
                </h1>
                <p
                  className="text-white text-opacity-80 text-lg font-medium"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Ready to send a package? 📦✨
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-8xl">🚚</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#0500FF] relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 opacity-10 text-9xl transform rotate-12 -mr-8 -mt-8 group-hover:scale-110 transition-transform">
                📦
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-semibold text-[#929292] uppercase tracking-wide"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    Total Orders
                  </p>
                  <p
                    className="text-5xl font-black text-[#000000] mt-2"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-[#0500FF] p-5 rounded-2xl shadow-lg">
                  <span className="text-white text-4xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#FF7000] relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 opacity-10 text-9xl transform rotate-12 -mr-8 -mt-8 group-hover:scale-110 transition-transform">
                ⏳
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-semibold text-[#929292] uppercase tracking-wide"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    Pending
                  </p>
                  <p
                    className="text-5xl font-black text-[#000000] mt-2"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="bg-[#FF7000] p-5 rounded-2xl shadow-lg">
                  <span className="text-white text-4xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#18CFFF] relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 opacity-10 text-9xl transform rotate-12 -mr-8 -mt-8 group-hover:scale-110 transition-transform">
                ✅
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p
                    className="text-sm font-semibold text-[#929292] uppercase tracking-wide"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    Delivered
                  </p>
                  <p
                    className="text-5xl font-black text-[#000000] mt-2"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    {stats.deliveredOrders}
                  </p>
                </div>
                <div className="bg-[#18CFFF] p-5 rounded-2xl shadow-lg">
                  <span className="text-white text-4xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/customer/new-order"
              className="bg-gradient-to-br from-[#0500FF] to-[#0400cc] text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-white bg-opacity-20 rounded-3xl p-6 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-7xl">🚚</span>
                </div>
                <h3
                  className="text-2xl font-black mb-2"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  New Delivery
                </h3>
                <p
                  className="text-white text-opacity-90 font-medium"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Create a new delivery order
                </p>
              </div>
            </Link>

            <Link
              to="/customer/orders"
              className="bg-white text-[#000000] p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group border-2 border-[#E3E3E3] hover:border-[#0500FF] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0500FF] opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-[#0500FF] bg-opacity-10 rounded-3xl p-6 mb-4 group-hover:bg-opacity-20 group-hover:scale-110 transition-all duration-300">
                  <span className="text-7xl">📋</span>
                </div>
                <h3
                  className="text-2xl font-black mb-2"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  My Orders
                </h3>
                <p
                  className="text-[#929292] font-medium"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  View your order history
                </p>
              </div>
            </Link>

            <Link
              to="/customer/profile"
              className="bg-white text-[#000000] p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group border-2 border-[#E3E3E3] hover:border-[#0500FF] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0500FF] opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="bg-[#0500FF] bg-opacity-10 rounded-3xl p-6 mb-4 group-hover:bg-opacity-20 group-hover:scale-110 transition-all duration-300">
                  <span className="text-7xl">👤</span>
                </div>
                <h3
                  className="text-2xl font-black mb-2"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Profile
                </h3>
                <p
                  className="text-[#929292] font-medium"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Manage your account
                </p>
              </div>
            </Link>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl opacity-5 -mr-8 -mt-8">
              📦
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-3xl font-black text-[#000000]"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  Recent Orders
                </h2>
                <Link
                  to="/customer/orders"
                  className="text-[#0500FF] hover:text-[#0400cc] font-bold text-lg transition-colors flex items-center gap-2 group"
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                >
                  View All
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex justify-between items-center p-6 border-2 border-[#E3E3E3] rounded-2xl hover:border-[#0500FF] hover:shadow-lg transition-all group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#0500FF] transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      <div className="flex items-center gap-4 flex-1 ml-2">
                        <div className="bg-[#0500FF] bg-opacity-10 p-4 rounded-xl group-hover:bg-opacity-20 transition-all">
                          <span className="text-3xl">📦</span>
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-black text-[#000000] text-lg mb-1"
                            style={{
                              fontFamily: "'Poppins', 'Inter', sans-serif",
                            }}
                          >
                            Order #{order._id?.slice(-6)}
                          </p>
                          <p
                            className="text-sm text-[#929292] font-medium"
                            style={{
                              fontFamily: "'Poppins', 'Inter', sans-serif",
                            }}
                          >
                            {order.pickupAddress?.slice(0, 30)}... →{" "}
                            {order.dropAddress?.slice(0, 30)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          className="font-black text-[#000000] text-xl mb-2"
                          style={{
                            fontFamily: "'Poppins', 'Inter', sans-serif",
                          }}
                        >
                          ₹{order.fare}
                        </p>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold ${
                            order.status === "delivered"
                              ? "bg-[#18CFFF] text-white"
                              : order.status === "pending"
                              ? "bg-[#FF7000] text-white"
                              : "bg-[#0500FF] text-white"
                          }`}
                          style={{
                            fontFamily: "'Poppins', 'Inter', sans-serif",
                          }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-6 text-8xl">📭</div>
                  <p
                    className="text-[#929292] mb-6 text-lg font-medium"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    No orders yet
                  </p>
                  <Link
                    to="/customer/new-order"
                    className="bg-gradient-to-r from-[#0500FF] to-[#0400cc] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all font-bold text-lg inline-block transform hover:-translate-y-1"
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    Create Your First Order
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
