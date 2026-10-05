import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const DriverProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    availability: true,
  });
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDriverProfile(response.data);
      setFormData({
        name: response.data.user?.name || "",
        email: response.data.user?.email || "",
        phone: response.data.user?.phone || "",
        availability: response.data.availability || true,
      });
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://pick4u-yyco.onrender.com/api/driver/profile",
        { availability: formData.availability },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");
      setDriverProfile(response.data.driver);
    } catch (error) {
      setMessage(
        "Error updating profile: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getKycStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Approved ✅";
      case "PENDING":
        return "Under Review ⏳";
      case "REJECTED":
        return "Rejected ❌";
      default:
        return "Not Submitted";
    }
  };

  if (profileLoading) {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Driver Profile</h1>
            <p className="text-gray-600">
              Manage your driver account and settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Profile Settings
                </h2>

                {message && (
                  <div
                    className={`p-4 rounded-md mb-6 ${
                      message.includes("Error")
                        ? "bg-red-100 border border-red-400 text-red-700"
                        : "bg-green-100 border border-green-400 text-green-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Contact admin to change name
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Contact admin to change email
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contact admin to change phone
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability"
                      checked={formData.availability}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Available for new delivery jobs
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
                  >
                    {loading ? "Updating..." : "Update Availability"}
                  </button>
                </form>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              {/* Driver Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Driver Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">KYC Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getKycStatusColor(
                        driverProfile?.kycStatus
                      )}`}
                    >
                      {getKycStatusText(driverProfile?.kycStatus)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.availability
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.availability
                        ? "Available ✅"
                        : "Not Available ❌"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver Since</p>
                    <p className="font-medium text-gray-800">
                      {driverProfile?.createdAt
                        ? new Date(driverProfile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Driver ID</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {driverProfile?._id?.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              {/* KYC Documents */}
              {driverProfile?.kycStatus === "PENDING" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    KYC Under Review
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    Your KYC documents are being reviewed. This usually takes
                    24-48 hours.
                  </p>
                </div>
              )}

              {driverProfile?.kycStatus === "REJECTED" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-2">
                    KYC Rejected
                  </h4>
                  <p className="text-red-700 text-sm mb-3">
                    Your KYC was rejected. Please submit valid documents again.
                  </p>
                  <a
                    href="/driver/kyc"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Resubmit KYC
                  </a>
                </div>
              )}

              {(!driverProfile?.kycStatus ||
                driverProfile?.kycStatus === "REJECTED") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Complete KYC
                  </h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Complete KYC verification to start accepting delivery jobs.
                  </p>
                  <a
                    href="/driver/kyc"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start KYC
                  </a>
                </div>
              )}

              {/* Support */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>📞 Driver Support: +91 9876543210</p>
                  <p>📧 Email: drivers@pick4u.com</p>
                  <p>🕒 Support Hours: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverProfile;
