import React, { useEffect, useState } from "react";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../../api";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    getCoupons().then((res) => setCoupons(res.data));
  }, []);

  const handleAdd = async () => {
    await createCoupon({ code: newCode, discount: 10 });
    alert("Coupon created");
  };

  const handleUpdate = async (id) => {
    await updateCoupon(id, { discount: 15 });
    alert("Coupon updated");
  };

  const handleDelete = async (id) => {
    await deleteCoupon(id);
    alert("Coupon deleted");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Coupons</h2>
      <input
        value={newCode}
        onChange={(e) => setNewCode(e.target.value)}
        placeholder="New coupon code"
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleAdd}
        className="px-3 py-1 bg-sky-600 text-white rounded"
      >
        Add
      </button>
      <ul className="mt-4 space-y-3">
        {coupons.map((c) => (
          <li key={c._id} className="border p-3 rounded flex justify-between">
            <span>
              {c.code} - {c.discount}%
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleUpdate(c._id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
