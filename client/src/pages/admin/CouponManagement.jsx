import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const CouponManagement = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    expiry: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/coupons",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const generateCouponCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      code: code,
    });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://pick4u-yyco.onrender.com/api/admin/coupons", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Coupon created successfully!");
      setShowCreateModal(false);
      setFormData({
        code: "",
        type: "percentage",
        value: "",
        minOrder: "",
        maxDiscount: "",
        usageLimit: "",
        expiry: "",
        isActive: true,
      });
      fetchCoupons(); // Refresh coupons list
    } catch (error) {
      alert(
        "Error creating coupon: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleToggleActive = async (couponId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/coupons/${couponId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `Coupon ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      fetchCoupons(); // Refresh coupons list
    } catch (error) {
      alert(
        "Error updating coupon: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://pick4u-yyco.onrender.com/api/admin/coupons/${couponId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Coupon deleted successfully!");
      fetchCoupons(); // Refresh coupons list
    } catch (error) {
      alert(
        "Error deleting coupon: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const getStatusColor = (isActive, expiry) => {
    if (!isActive) return "bg-red-100 text-red-800";
    if (new Date(expiry) < new Date()) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (isActive, expiry) => {
    if (!isActive) return "Inactive";
    if (new Date(expiry) < new Date()) return "Expired";
    return "Active";
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
            <h1 className="text-3xl font-bold text-gray-800">
              Coupon Management
            </h1>
            <p className="text-gray-600">Create and manage discount coupons</p>
          </div>

          {/* Header with Create Button */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {coupons.length} Coupons
                </h3>
                <p className="text-gray-600">
                  Manage discount codes and promotions
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                + Create New Coupon
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {
                    coupons.filter(
                      (c) => c.isActive && new Date(c.expiry) > new Date()
                    ).length
                  }
                </p>
                <p className="text-sm text-blue-700">Active</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {coupons.filter((c) => c.type === "percentage").length}
                </p>
                <p className="text-sm text-green-700">Percentage</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {coupons.filter((c) => c.type === "fixed").length}
                </p>
                <p className="text-sm text-purple-700">Fixed Amount</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    coupons.filter((c) => new Date(c.expiry) < new Date())
                      .length
                  }
                </p>
                <p className="text-sm text-yellow-700">Expired</p>
              </div>
            </div>
          </div>

          {/* Coupons Grid */}
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {coupon.code}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {coupon.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        coupon.isActive,
                        coupon.expiry
                      )}`}
                    >
                      {getStatusText(coupon.isActive, coupon.expiry)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-green-600">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : `₹${coupon.value}`}
                      </span>
                    </div>
                    {coupon.minOrder && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Order:</span>
                        <span className="font-medium">₹{coupon.minOrder}</span>
                      </div>
                    )}
                    {coupon.maxDiscount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Discount:</span>
                        <span className="font-medium">
                          ₹{coupon.maxDiscount}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium">
                        {new Date(coupon.expiry).toLocaleDateString()}
                      </span>
                    </div>
                    {coupon.usageLimit && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usage Limit:</span>
                        <span className="font-medium">
                          {coupon.usageLimit} times
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleToggleActive(coupon._id, coupon.isActive)
                      }
                      className={`flex-1 py-2 px-4 rounded-md font-medium ${
                        coupon.isActive
                          ? "bg-yellow-600 text-white hover:bg-yellow-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Coupons Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first discount coupon to attract more customers.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create First Coupon
              </button>
            </div>
          )}

          {/* Create Coupon Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Create New Coupon
                  </h3>

                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coupon Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter code"
                          required
                        />
                        <button
                          type="button"
                          onClick={generateCouponCode}
                          className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
                        >
                          Generate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          formData.type === "percentage" ? "10" : "100"
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Order (₹)
                      </label>
                      <input
                        type="number"
                        name="minOrder"
                        value={formData.minOrder}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Discount (₹)
                      </label>
                      <input
                        type="number"
                        name="maxDiscount"
                        value={formData.maxDiscount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="No limit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        name="usageLimit"
                        value={formData.usageLimit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Active immediately
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Create Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Coupon Strategy Tips */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-3">
              Coupon Strategy Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p className="font-medium mb-2">🎯 Effective Coupon Types:</p>
                <ul className="space-y-1">
                  <li>• First-order discounts (10-15%)</li>
                  <li>• Seasonal promotions (Diwali, Christmas)</li>
                  <li>• Bulk order discounts</li>
                  <li>• Referral codes</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">📊 Best Practices:</p>
                <ul className="space-y-1">
                  <li>• Set reasonable expiry dates</li>
                  <li>• Use minimum order values</li>
                  <li>• Limit usage to prevent abuse</li>
                  <li>• Track redemption rates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CouponManagement;
