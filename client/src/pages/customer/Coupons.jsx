import React, { useState } from "react";
import { applyCoupon, removeCoupon } from "../../api";

export default function Coupons() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const handleApply = async () => {
    const res = await applyCoupon({ couponCode: code });
    setMsg(res.data.message);
  };

  const handleRemove = async () => {
    const res = await removeCoupon({ couponCode: code });
    setMsg(res.data.message);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Coupons</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter coupon code"
        className="w-full border p-2 rounded"
      />
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="bg-sky-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={handleRemove}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Remove
        </button>
      </div>
      {msg && <p className="text-green-600">{msg}</p>}
    </div>
  );
}
