import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DriverTable from "../../components/admin/DriverTable";
import axios from "axios";

const DriversList = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/drivers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKyc = (driver) => {
    // Navigate to KYC approval page or show modal
    window.location.href = `/admin/pending-kyc`;
  };

  const handleBlockDriver = async (driver) => {
    const action = driver.user?.isBlocked ? "unblock" : "block";
    const confirmMessage = `Are you sure you want to ${action} ${driver.user?.name}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/drivers/${driver._id}/block`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Driver ${action}ed successfully!`);
      fetchDrivers(); // Refresh drivers list
    } catch (error) {
      alert(
        `Error ${action}ing driver: ` +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleViewDetails = (driver) => {
    // Navigate to driver details page
    alert(`View details for driver ${driver.user?.name}`);
  };

  const filteredDrivers = drivers.filter((driver) => {
    if (filter === "all") return true;
    if (filter === "approved") return driver.kycStatus === "APPROVED";
    if (filter === "pending") return driver.kycStatus === "PENDING";
    if (filter === "blocked") return driver.user?.isBlocked;
    return true;
  });

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case "approved":
        return drivers.filter((d) => d.kycStatus === "APPROVED").length;
      case "pending":
        return drivers.filter((d) => d.kycStatus === "PENDING").length;
      case "blocked":
        return drivers.filter((d) => d.user?.isBlocked).length;
      default:
        return drivers.length;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Drivers Management
            </h1>
            <p className="text-gray-600">
              Manage driver accounts and KYC approvals
            </p>
          </div>

          {/* Stats and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {filteredDrivers.length} {filter === "all" ? "Total" : filter}{" "}
                  Drivers
                </h3>
                <p className="text-gray-600">
                  Manage driver accounts and verifications
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({getFilterCount("all")})
                </button>
                <button
                  onClick={() => setFilter("approved")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "approved"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved ({getFilterCount("approved")})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "pending"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending KYC ({getFilterCount("pending")})
                </button>
                <button
                  onClick={() => setFilter("blocked")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === "blocked"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Blocked ({getFilterCount("blocked")})
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {drivers.length}
                </p>
                <p className="text-sm text-blue-700">Total Drivers</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {getFilterCount("approved")}
                </p>
                <p className="text-sm text-green-700">Active</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {getFilterCount("pending")}
                </p>
                <p className="text-sm text-yellow-700">Pending KYC</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {getFilterCount("blocked")}
                </p>
                <p className="text-sm text-red-700">Blocked</p>
              </div>
            </div>
          </div>

          {/* Drivers Table */}
          <DriverTable
            drivers={filteredDrivers}
            onApproveKyc={handleApproveKyc}
            onBlock={handleBlockDriver}
            onViewDetails={handleViewDetails}
          />

          {/* Actions Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">
                KYC Approval Process
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Verify driving license authenticity</li>
                <li>• Check Aadhar card details</li>
                <li>• Validate vehicle documents</li>
                <li>• Review background information</li>
                <li>• Approve or reject with reason</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">
                Driver Management Tips
              </h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Monitor driver ratings regularly</li>
                <li>• Check delivery completion rates</li>
                <li>• Review customer feedback</li>
                <li>• Track driver availability</li>
                <li>• Provide training when needed</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriversList;
