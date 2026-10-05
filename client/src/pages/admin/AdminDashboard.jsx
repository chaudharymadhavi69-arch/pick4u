import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StatsCard from "../../components/admin/StatsCard";
import axios from "axios";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalDrivers: 0,
    totalCustomers: 0,
    pendingKyc: 0,
    todayOrders: 0,
    totalEarnings: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ordersResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const driversResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/drivers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const kycResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/drivers/pending-kyc",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDashboardData({
        totalOrders: response.data.totalOrders || 0,
        activeOrders: response.data.activeOrders || 0,
        totalDrivers: response.data.totalDrivers || 0,
        totalCustomers: response.data.totalCustomers || 0,
        pendingKyc: kycResponse.data.length || 0,
        todayOrders: ordersResponse.data.filter(
          (order) =>
            new Date(order.createdAt).toDateString() ===
            new Date().toDateString()
        ).length,
        totalEarnings: ordersResponse.data.reduce(
          (sum, order) => sum + order.fare,
          0
        ),
      });

      setRecentOrders(ordersResponse.data.slice(0, 5));
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Orders"
              value={dashboardData.totalOrders}
              icon="📦"
              color="blue"
              change={5}
            />
            <StatsCard
              title="Active Orders"
              value={dashboardData.activeOrders}
              icon="🔄"
              color="yellow"
              change={-2}
            />
            <StatsCard
              title="Total Drivers"
              value={dashboardData.totalDrivers}
              icon="🚗"
              color="green"
              change={8}
            />
            <StatsCard
              title="Total Customers"
              value={dashboardData.totalCustomers}
              icon="👥"
              color="purple"
              change={12}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Pending KYC"
              value={dashboardData.pendingKyc}
              icon="📋"
              color="red"
            />
            <StatsCard
              title="Today's Orders"
              value={dashboardData.todayOrders}
              icon="📅"
              color="blue"
            />
            <StatsCard
              title="Total Earnings"
              value={`₹${dashboardData.totalEarnings}`}
              icon="💰"
              color="green"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <a
              href="/admin/orders"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Manage Orders
              </h3>
              <p className="text-gray-600 text-sm">
                View and assign delivery orders
              </p>
            </a>

            <a
              href="/admin/drivers"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-3">🚗</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Manage Drivers
              </h3>
              <p className="text-gray-600 text-sm">
                Approve KYC and manage drivers
              </p>
            </a>

            <a
              href="/admin/pending-kyc"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                KYC Requests
              </h3>
              <p className="text-gray-600 text-sm">
                {dashboardData.pendingKyc} pending reviews
              </p>
            </a>

            <a
              href="/admin/customers"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Customers
              </h3>
              <p className="text-gray-600 text-sm">Manage customer accounts</p>
            </a>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Recent Orders
              </h2>
              <a
                href="/admin/orders"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                View All
              </a>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order._id?.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.name} •{" "}
                        {order.pickupAddress?.slice(0, 30)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.fare}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                System Status
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Orders System:</span>
                  <span className="font-semibold">✅ Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver App:</span>
                  <span className="font-semibold">✅ Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold">✅ Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Real-time Tracking:</span>
                  <span className="font-semibold">✅ Operational</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Quick Links
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <a href="/admin/coupons" className="block hover:underline">
                  🎫 Manage Coupons
                </a>
                <a href="/admin/fare-config" className="block hover:underline">
                  💰 Fare Configuration
                </a>
                <a href="/admin/reports" className="block hover:underline">
                  📊 Generate Reports
                </a>
                <a href="/admin/settings" className="block hover:underline">
                  ⚙️ System Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
