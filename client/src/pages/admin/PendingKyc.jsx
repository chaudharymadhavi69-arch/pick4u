import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PendingKyc = () => {
  const { user } = useAuth();
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const fetchPendingKyc = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/admin/drivers/pending-kyc",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingDrivers(response.data);
    } catch (error) {
      console.error("Error fetching pending KYC:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewKyc = (driver) => {
    setSelectedDriver(driver);
    setShowReviewModal(true);
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/drivers/${selectedDriver._id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("KYC approved successfully!");
      setShowReviewModal(false);
      setSelectedDriver(null);
      fetchPendingKyc(); // Refresh list
    } catch (error) {
      alert(
        "Error approving KYC: " +
          (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please enter reason for rejection:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://pick4u-yyco.onrender.com/api/admin/drivers/${selectedDriver._id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("KYC rejected successfully!");
      setShowReviewModal(false);
      setSelectedDriver(null);
      fetchPendingKyc(); // Refresh list
    } catch (error) {
      alert(
        "Error rejecting KYC: " +
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Pending KYC Requests
            </h1>
            <p className="text-gray-600">
              Review and approve driver KYC documents
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {pendingDrivers.length} Pending KYC Requests
                </h3>
                <p className="text-gray-600">
                  Review driver documents and approve/reject KYC applications
                </p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                ⏳ Requires Attention
              </div>
            </div>
          </div>

          {/* Pending KYC List */}
          {pendingDrivers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center font-semibold">
                      {driver.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {driver.user?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {driver.user?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Driving License</p>
                      <p className="font-medium text-gray-800">
                        {driver.licenseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aadhar Number</p>
                      <p className="font-medium text-gray-800">
                        {driver.aadharNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Submitted Documents
                      </p>
                      <p className="text-sm text-gray-800">
                        {driver.kycDocs?.length || 0} files uploaded
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReviewKyc(driver)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Review Documents
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                All Caught Up!
              </h3>
              <p className="text-gray-600 mb-6">
                There are no pending KYC requests at the moment.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-green-700">
                  All driver KYC applications have been processed
                </p>
              </div>
            </div>
          )}

          {/* Review Modal */}
          {showReviewModal && selectedDriver && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Review KYC - {selectedDriver.user?.name}
                  </h3>

                  {/* Driver Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{selectedDriver.user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {selectedDriver.user?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedDriver.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">License Number</p>
                      <p className="font-medium">
                        {selectedDriver.licenseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aadhar Number</p>
                      <p className="font-medium">
                        {selectedDriver.aadharNumber}
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Documents */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Uploaded Documents
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedDriver.kycDocs?.map((doc, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 text-center"
                        >
                          <div className="text-2xl mb-2">📄</div>
                          <p className="text-sm text-gray-600">
                            Document {index + 1}
                          </p>
                          <a
                            href={`http://localhost:5000${doc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setSelectedDriver(null);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Reject KYC
                    </button>
                    <button
                      onClick={handleApprove}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Approve KYC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">
              KYC Review Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-2">✅ Approve When:</p>
                <ul className="space-y-1">
                  <li>• All documents are clear and valid</li>
                  <li>• License and Aadhar details match</li>
                  <li>• Documents are not expired</li>
                  <li>• Photos are clear and recognizable</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">❌ Reject When:</p>
                <ul className="space-y-1">
                  <li>• Documents are blurry or incomplete</li>
                  <li>• Information doesn't match</li>
                  <li>• Documents are expired</li>
                  <li>• Suspicious or fake documents</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PendingKyc;
