import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import OrderTracking from "../../components/customer/OrderTracking";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

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

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/customer/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order cancelled successfully");
      fetchOrderDetails(); // Refresh order data
    } catch (error) {
      alert(
        "Error cancelling order: " +
          (error.response?.data?.message || "Something went wrong")
      );
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
              <h1 className="text-3xl font-bold text-gray-800">
                Order Details
              </h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
            </div>
            <button
              onClick={() => navigate("/customer/orders")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Orders
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Tracking */}
            <div>
              <OrderTracking order={order} />
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "accepted"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Weight:</span>
                    <span className="text-gray-800">
                      {order.packageWeight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Type:</span>
                    <span className="text-gray-800">{order.deliveryType}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-3">
                    <span className="text-gray-800">Total Fare:</span>
                    <span className="text-blue-600">₹{order.fare}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Pickup Address
                    </h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {order.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Delivery Address
                    </h4>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                      {order.dropAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              {order.assignedDriver && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Driver Information
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-semibold">
                      {order.assignedDriver.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.assignedDriver.name}
                      </p>
                      <p className="text-gray-600">
                        {order.assignedDriver.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {order.status === "pending" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Order Actions
                  </h3>
                  <button
                    onClick={handleCancelOrder}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
