import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState(0);
  const [reports, setReports] = useState({
    totalJobs: 0,
    totalEarnings: 0,
    orders: [],
  });
  const [timeRange, setTimeRange] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch total earnings
      const earningsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/earnings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch detailed reports
      const reportsResponse = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/reports",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEarnings(earningsResponse.data.earnings || 0);
      setReports(reportsResponse.data);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = reports.orders.filter((order) => {
    if (timeRange === "all") return true;

    const orderDate = new Date(order.deliveredAt || order.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (timeRange) {
      case "today":
        return diffDays <= 1;
      case "week":
        return diffDays <= 7;
      case "month":
        return diffDays <= 30;
      default:
        return true;
    }
  });

  const calculateFilteredEarnings = () => {
    return filteredOrders.reduce((total, order) => total + order.fare, 0);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Earnings</h1>
            <p className="text-gray-600">
              Track your delivery earnings and performance
            </p>
          </div>

          {/* Earnings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{earnings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="text-blue-600 text-xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Deliveries</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {reports.totalJobs}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Average per Delivery</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹
                    {reports.totalJobs > 0
                      ? Math.round(earnings / reports.totalJobs)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Earnings Breakdown
                </h3>
                <p className="text-gray-600">Filter by time period</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimeRange("today")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    timeRange === "today"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    timeRange === "week"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    timeRange === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeRange("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    timeRange === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Filtered Summary */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredOrders.length}
                </p>
                <p className="text-sm text-blue-700">Deliveries</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  ₹{calculateFilteredEarnings()}
                </p>
                <p className="text-sm text-green-700">Earnings</p>
              </div>
            </div>
          </div>

          {/* Earnings History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Delivery History
              </h2>
              <p className="text-gray-600">
                Showing {filteredOrders.length} of {reports.orders.length}{" "}
                deliveries
              </p>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Order #{order._id?.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            order.deliveredAt || order.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ₹{order.fare}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.packageWeight} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Earnings Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  {timeRange === "all"
                    ? "You haven't completed any deliveries yet."
                    : `No earnings found for ${timeRange} period.`}
                </p>
                {timeRange === "all" && (
                  <a
                    href="/driver/jobs"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Start Delivering
                  </a>
                )}
              </div>
            )}

            {/* Total for period */}
            {filteredOrders.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Total for {timeRange}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{calculateFilteredEarnings()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">
                💳 Payment Schedule
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Earnings updated in real-time</li>
                <li>• Weekly payments every Monday</li>
                <li>• Minimum payout: ₹500</li>
                <li>• Payment method: Bank Transfer</li>
                <li>• Contact support for payment issues</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">
                📈 Tips to Earn More
              </h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Accept high-value delivery jobs</li>
                <li>• Maintain high rating and reliability</li>
                <li>• Work during peak hours</li>
                <li>• Complete deliveries quickly</li>
                <li>• Provide excellent customer service</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Earnings;
