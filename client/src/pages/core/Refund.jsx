import React, { useState } from "react";
import { refundPayment } from "../../api";

export default function Refund() {
  const [paymentId, setPaymentId] = useState("");

  const handleRefund = async () => {
    try {
      await refundPayment({ paymentId });
      alert("Refund processed successfully");
    } catch (err) {
      console.error("Refund failed", err);
      alert("Refund failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Payment Refund</h2>
      <input
        type="text"
        placeholder="Payment ID"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleRefund}
        className="w-full py-2 bg-red-600 text-white rounded"
      >
        Refund Payment
      </button>
    </div>
  );
}
