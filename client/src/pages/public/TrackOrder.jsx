import React, { useState } from "react";

export default function TrackOrder() {
  const [id, setId] = useState("");
  const search = (e) => {
    e.preventDefault();
    // call /api/orders/track/:id later
    alert("Track order: " + id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
        <form onSubmit={search} className="flex gap-3">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">
            Track
          </button>
        </form>
      </div>
    </div>
  );
}
