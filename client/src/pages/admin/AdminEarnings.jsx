import React, { useEffect, useState } from "react";
import { getEarnings } from "../../api/adminApi";

export default function AdminEarnings() {
  const [earnings, setEarnings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEarnings() {
      const res = await getEarnings(token);
      setEarnings(res.data);
    }
    fetchEarnings();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Driver Earnings</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Driver</th>
            <th className="p-2 border">Total Orders</th>
            <th className="p-2 border">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((e) => (
            <tr key={e.driverId}>
              <td className="p-2 border">{e.driverName}</td>
              <td className="p-2 border">{e.totalOrders}</td>
              <td className="p-2 border">₹{e.totalEarnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
