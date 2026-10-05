import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import KycUploader from "../../components/driver/KycUploader";
import axios from "axios";

const KycUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setKycStatus(response.data.kycStatus);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (data) => {
    setKycStatus("PENDING");
    alert("KYC documents submitted successfully! Under review.");
  };

  const getStatusDisplay = () => {
    switch (kycStatus) {
      case "APPROVED":
        return {
          title: "KYC Approved ✅",
          message:
            "Your KYC verification is complete. You can now accept delivery jobs.",
          color: "green",
        };
      case "PENDING":
        return {
          title: "KYC Under Review ⏳",
          message:
            "Your documents are under review. We will notify you once approved.",
          color: "yellow",
        };
      case "REJECTED":
        return {
          title: "KYC Rejected ❌",
          message:
            "Your KYC was rejected. Please submit valid documents again.",
          color: "red",
        };
      default:
        return {
          title: "KYC Required 📋",
          message:
            "Please complete KYC verification to start accepting delivery jobs.",
          color: "blue",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              KYC Verification
            </h1>
            <p className="text-gray-600">
              Submit your documents for verification
            </p>
          </div>

          {/* Status Banner */}
          <div
            className={`bg-${statusDisplay.color}-50 border border-${statusDisplay.color}-200 rounded-lg p-6 mb-8`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-lg font-semibold text-${statusDisplay.color}-800 mb-1`}
                >
                  {statusDisplay.title}
                </h3>
                <p className={`text-${statusDisplay.color}-700`}>
                  {statusDisplay.message}
                </p>
              </div>
              {kycStatus === "APPROVED" && (
                <button
                  onClick={() => navigate("/driver")}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>

          {/* KYC Upload Form */}
          {!kycStatus || kycStatus === "REJECTED" ? (
            <KycUploader onUploadComplete={handleUploadComplete} />
          ) : kycStatus === "PENDING" ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Under Review
              </h3>
              <p className="text-gray-600 mb-6">
                Your KYC documents are being reviewed by our team. This usually
                takes 24-48 hours.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                <p className="text-yellow-700 font-medium">
                  We'll notify you once approved
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Complete
              </h3>
              <p className="text-gray-600 mb-6">
                Your KYC has been approved. You can now accept delivery jobs and
                start earning.
              </p>
              <button
                onClick={() => navigate("/driver/jobs")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Start Accepting Jobs
              </button>
            </div>
          )}

          {/* Information Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">
                Why KYC is Required?
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Ensures driver authenticity and safety</li>
                <li>• Required for insurance coverage</li>
                <li>• Builds trust with customers</li>
                <li>• Compliance with regulations</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">
                What Happens Next?
              </h4>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Document verification (24-48 hours)</li>
                <li>• Background check completion</li>
                <li>• Approval notification</li>
                <li>• Start accepting delivery jobs</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KycUpload;
