import React, { useEffect, useState } from "react";
import { getCustomers, suspendCustomer } from "../../api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then((res) => setCustomers(res.data));
  }, []);

  const handleSuspend = async (id) => {
    await suspendCustomer(id);
    alert("Customer suspended");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Customers</h2>
      <ul className="space-y-3">
        {customers.map((c) => (
          <li
            key={c._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              {c.name} ({c.email})
            </span>
            <button
              onClick={() => handleSuspend(c._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Suspend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
