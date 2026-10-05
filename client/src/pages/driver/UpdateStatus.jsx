import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../api";
import { useSocket } from "../../context/SocketContext";

export default function UpdateStatus() {
  const { id } = useParams(); // jobId
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("");
  const socket = useSocket();

  useEffect(() => {
    getOrderById(id).then((res) => {
      setJob(res.data);
      setStatus(res.data.status);
    });
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await updateOrderStatus(id, { status });
      setJob(res.data.order);

      // Notify via socket
      if (socket) {
        socket.emit("order-status-update", {
          orderId: id,
          status,
          driverId: job.assignedDriver?._id,
        });
      }
      alert("Status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  if (!job) return <p className="p-6">Loading job...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚚 Update Job Status</h2>

      <div className="p-4 border rounded bg-white shadow-sm space-y-4">
        <p className="font-medium">
          {job.pickupAddress} → {job.dropAddress}
        </p>
        <p>Fare: ₹{job.fare}</p>

        <label className="block font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="picked-up">Picked Up</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
