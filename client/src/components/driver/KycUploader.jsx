import React, { useState } from "react";
import axios from "axios";

const KycUploader = ({ onUploadComplete }) => {
  const [formData, setFormData] = useState({
    licenseNumber: "",
    aadharNumber: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.licenseNumber || !formData.aadharNumber) {
      setMessage("Please fill all required fields");
      return;
    }

    if (files.length === 0) {
      setMessage("Please upload at least one document");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const uploadData = new FormData();

      // Add form data
      uploadData.append("licenseNumber", formData.licenseNumber);
      uploadData.append("aadharNumber", formData.aadharNumber);

      // Add files
      files.forEach((file) => {
        uploadData.append("docs", file);
      });

      const response = await axios.post(
        "https://pick4u-yyco.onrender.com/api/driver/kyc",
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("KYC documents submitted successfully!");
      if (onUploadComplete) {
        onUploadComplete(response.data);
      }

      // Reset form
      setFormData({ licenseNumber: "", aadharNumber: "" });
      setFiles([]);
    } catch (error) {
      setMessage(
        "Error submitting KYC: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        KYC Verification
      </h3>

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
              Driving License Number *
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="DL12345678901234"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Number *
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="1234 5678 9012"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Documents *
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            accept=".jpg,.jpeg,.png,.pdf"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload driving license, Aadhar card, and vehicle documents (Max 5
            files, JPG, PNG, PDF)
          </p>

          {files.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">
                Selected files:
              </p>
              <ul className="text-sm text-gray-600 mt-1">
                {files.map((file, index) => (
                  <li key={index}>• {file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
        >
          {loading ? "Submitting KYC..." : "Submit KYC Documents"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">
          📋 Required Documents
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Driving License (Front & Back)</li>
          <li>• Aadhar Card (Front & Back)</li>
          <li>• Vehicle Registration Certificate</li>
          <li>• Vehicle Insurance</li>
          <li>• Passport Size Photo</li>
        </ul>
      </div>
    </div>
  );
};

export default KycUploader;
