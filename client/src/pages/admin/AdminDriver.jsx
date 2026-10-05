import React, { useEffect, useState } from "react";
import {
  getPendingKycDrivers,
  approveDriver,
  rejectDriver,
} from "../../api/adminApi";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    const res = await getPendingKycDrivers();
    setDrivers(res.data);
  };

  const handleApprove = async (id) => {
    await approveDriver(id);
    alert("Driver approved");
    loadDrivers();
  };

  const handleReject = async (id) => {
    await rejectDriver(id);
    alert("Driver rejected");
    loadDrivers();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🚖 Pending KYC Drivers</h2>
      {drivers.length === 0 && <p>No pending KYC requests</p>}
      <ul className="space-y-4">
        {drivers.map((d) => (
          <li
            key={d._id}
            className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p>{d.user.name}</p>
              <p>Email: {d.user.email}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleApprove(d._id)}>Approve</button>
              <button onClick={() => handleReject(d._id)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
