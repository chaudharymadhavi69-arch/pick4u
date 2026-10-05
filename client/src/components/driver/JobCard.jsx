import React from "react";

const JobCard = ({
  job,
  onAccept,
  onReject,
  showActions = true,
  acceptAssignedJob,
  rejectAssignedJob,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "picked":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAddress = (address) => {
    return address?.length > 60 ? address.substring(0, 60) + "..." : address;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{job._id?.slice(-6)}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            job.status
          )}`}
        >
          {job.status?.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">Pickup</p>
          <p className="text-gray-800">{formatAddress(job.pickupAddress)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Delivery</p>
          <p className="text-gray-800">{formatAddress(job.dropAddress)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-green-600">₹{job.fare}</p>
          <p className="text-sm text-gray-600">
            {job.packageWeight} kg • {job.deliveryType}
          </p>
        </div>
        {job.customer && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {job.customer.name}
            </p>
            <p className="text-xs text-gray-600">{job.customer.phone}</p>
          </div>
        )}
      </div>

      {showActions && job.status === "pending" && (
        <div className="flex space-x-3">
          <button
            onClick={() => onReject(job._id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(job._id)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Accept
          </button>
        </div>
      )}

      {/* Admin Assigned Job Section */}
      {job.status === "assigned" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">
            Admin Assigned Job - Action Required
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => acceptAssignedJob(job._id)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              ✅ Accept Job
            </button>
            <button
              onClick={() => rejectAssignedJob(job._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              ❌ Reject Job
            </button>
          </div>
        </div>
      )}

      {!showActions &&
        job.status !== "pending" &&
        job.status !== "assigned" && (
          <div className="text-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                job.status
              )}`}
            >
              {job.status === "accepted" ? "Assigned to You" : job.status}
            </span>
          </div>
        )}
    </div>
  );
};

export default JobCard;
