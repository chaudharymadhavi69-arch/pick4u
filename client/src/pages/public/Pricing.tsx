import React from "react";

export default function Pricing() {
  const plans = [
    { name: "Instant", desc: "Fastest", price: "₹150 + distance" },
    { name: "Same-day", desc: "Same day delivery", price: "₹80 + distance" },
    { name: "Standard", desc: "1-3 business days", price: "₹40 + distance" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-gray-600 mb-4">{p.desc}</p>
              <div className="text-2xl font-bold">{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
