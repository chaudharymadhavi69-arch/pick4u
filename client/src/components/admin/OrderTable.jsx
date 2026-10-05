import React from "react";
import { useNavigate } from "react-router-dom";

const OrderTable = ({
  orders,
  onAssignDriver,
  onViewDetails,
  currentFilter = "all",
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
      accepted: { color: "bg-green-100 text-green-800", label: "Accepted" },
      arrived: { color: "bg-purple-100 text-purple-800", label: "Arrived" },
      "picked-up": {
        color: "bg-indigo-100 text-indigo-800",
        label: "Picked Up",
      },
      "on-the-way": {
        color: "bg-orange-100 text-orange-800",
        label: "On the Way",
      },
      delivered: {
        color: "bg-emerald-100 text-emerald-800",
        label: "Delivered",
      },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleViewTracking = (order) => {
    // ✅ Direct navigation to tracking page
    navigate(`/admin/orders/${order._id}/tracking`);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">
          {currentFilter === "pending"
            ? "📭"
            : currentFilter === "delivered"
            ? "✅"
            : currentFilter === "cancelled"
            ? "❌"
            : "📦"}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-600">
          {currentFilter === "all"
            ? "No orders have been placed yet."
            : `No ${currentFilter} orders found.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fare
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.customer?.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.phone || "No phone"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    <strong>From:</strong> {order.pickupAddress}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    <strong>To:</strong> {order.dropAddress}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    ₹{order.fare}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.assignedDriver?.name || "Not assigned"}
                  </div>
                  {order.assignedDriver?.phone && (
                    <div className="text-sm text-gray-500">
                      {order.assignedDriver.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {/* ✅ View Tracking Button */}
                    <button
                      onClick={() => handleViewTracking(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-xs"
                    >
                      Track Order
                    </button>

                    {/* Assign Driver Button (only for pending orders) */}
                    {order.status === "pending" && (
                      <button
                        onClick={() => onAssignDriver(order)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-xs"
                      >
                        Assign Driver
                      </button>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => onViewDetails(order)}
                      className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-xs"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
