import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DriverReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://pick4u-yyco.onrender.com/api/driver/reports",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("📊 Reports API Response:", response.data); // Debug log

      // ✅ Check different possible response formats
      let reportsData = [];

      if (Array.isArray(response.data)) {
        // Case 1: Direct array
        reportsData = response.data;
      } else if (response.data && Array.isArray(response.data.reports)) {
        // Case 2: { reports: [...] }
        reportsData = response.data.reports;
      } else if (response.data && Array.isArray(response.data.jobs)) {
        // Case 3: { jobs: [...] }
        reportsData = response.data.jobs;
      } else if (response.data && response.data.completedJobs) {
        // Case 4: { completedJobs: [...] }
        reportsData = response.data.completedJobs;
      } else if (response.data && typeof response.data === "object") {
        // Case 5: Single object - convert to array
        reportsData = [response.data];
      } else {
        console.warn("⚠️ Unexpected API response format:", response.data);
        reportsData = [];
      }

      console.log("✅ Processed reports data:", reportsData);
      setReports(reportsData);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      setError("Failed to load reports. Please try again.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4 text-red-500">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchReports}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Driver Reports
          </h2>

          {/* Debug Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <strong>Total Reports:</strong> {reports.length}
              </p>
              <p>
                <strong>API Status:</strong>{" "}
                {reports.length > 0 ? "✅ Data Loaded" : "⚠️ No Data"}
              </p>
            </div>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Display all report properties */}
                    {Object.entries(report).map(([key, value]) => (
                      <div key={key}>
                        <strong className="text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </strong>
                        <span className="ml-2 text-gray-600">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Reports Available
              </h3>
              <p className="text-gray-600 mb-6">
                There are no reports to display at the moment.
              </p>
              <button
                onClick={fetchReports}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Refresh Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
