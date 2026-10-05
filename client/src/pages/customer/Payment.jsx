import React, { useState } from "react";
import { makePayment, verifyPayment } from "../../api/payment";

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [msg, setMsg] = useState("");

  const handlePay = async () => {
    const res = await makePayment({ orderId, amount });
    setMsg(res.data.message || "Payment initiated");
  };

  const handleVerify = async () => {
    const res = await verifyPayment({ orderId, paymentId: "dummy_id" });
    setMsg(res.data.message || "Payment verified");
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Payment</h2>
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        className="w-full border p-2 rounded"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        type="number"
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handlePay}
        className="bg-sky-600 text-white px-4 py-2 rounded w-full"
      >
        Pay Now
      </button>
      <button
        onClick={handleVerify}
        className="bg-emerald-600 text-white px-4 py-2 rounded w-full"
      >
        Verify Payment
      </button>
      {msg && <p className="text-blue-600">{msg}</p>}
    </div>
  );
}
