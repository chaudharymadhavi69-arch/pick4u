import React, { useState } from "react";
import { createOrder, getFareEstimate } from "../../api";

export default function BookOrder() {
  const [form, setForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "same-day",
  });
  const [fare, setFare] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fareLoading, setFareLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // 🔹 Get fare estimate
  const handleFare = async () => {
    if (!form.pickupAddress || !form.dropAddress || !form.packageWeight) {
      setMessage({
        type: "error",
        text: "Please fill all fields to get fare estimate",
      });
      return;
    }

    try {
      setFareLoading(true);
      setMessage(null);

      const payload = {
        pickupAddress: form.pickupAddress,
        dropAddress: form.dropAddress,
        packageWeight: Number(form.packageWeight), // ✅ Correct key name
        deliveryType: form.deliveryType,
      };

      const res = await getFareEstimate(payload);
      setFare(res.data.fare);
      setMessage({ type: "success", text: "Fare calculated successfully!" });
    } catch (err) {
      console.error("Fare Estimate Error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to get fare estimate",
      });
    } finally {
      setFareLoading(false);
    }
  };

  // 🔹 Book order (without payment)
  const handleBook = async () => {
    if (!form.pickupAddress || !form.dropAddress || !form.packageWeight) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const payload = {
        pickupAddress: form.pickupAddress,
        dropAddress: form.dropAddress,
        packageWeight: Number(form.packageWeight),
        deliveryType: form.deliveryType,
        fare: fare, // ✅ send this to backend
      };

      const res = await createOrder(payload);

      setMessage({
        type: "success",
        text: res.data.message || "Order booked successfully!",
      });

      setTimeout(() => {
        setForm({
          pickupAddress: "",
          dropAddress: "",
          packageWeight: "",
          deliveryType: "same-day",
        });
        setFare(null);
      }, 2000);
    } catch (err) {
      console.error("Book Order Error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to book order",
      });
    } finally {
      setLoading(false);
    }
  };

  const deliveryTypes = [
    {
      value: "same-day",
      label: "Same Day",
      icon: "📦",
      desc: "Delivery within 24 hours",
      badge: "Popular",
    },
    {
      value: "instant",
      label: "Instant",
      icon: "⚡",
      desc: "Express delivery in 2-3 hours",
      badge: "Fast",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">📦 Book New Order</h1>
          <p className="text-gray-200">
            Fast, reliable, and affordable delivery service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Details
            </h2>

            {/* Alert Messages */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.type === "error"
                    ? "bg-[#FF3318] bg-opacity-10 border border-[#FF3318] border-opacity-30"
                    : "bg-[#0D3483] bg-opacity-10 border border-[#0D3483] border-opacity-30"
                }`}
              >
                <span className="text-2xl">
                  {message.type === "error" ? "❌" : "✅"}
                </span>
                <p
                  className={`text-sm font-medium ${
                    message.type === "error"
                      ? "text-[#FF3318]"
                      : "text-[#0D3483]"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Pickup Address */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Pickup Address
              </label>
              <textarea
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={onChange}
                placeholder="Enter pickup location (e.g., MG Road, Bangalore)"
                rows="2"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0500FF] focus:ring-2 focus:ring-[#0500FF] focus:ring-opacity-20 transition-all outline-none resize-none"
              />
            </div>

            {/* Drop Address */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Drop Address
              </label>
              <textarea
                name="dropAddress"
                value={form.dropAddress}
                onChange={onChange}
                placeholder="Enter drop location (e.g., Koramangala, Bangalore)"
                rows="2"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0500FF] focus:ring-2 focus:ring-[#0500FF] focus:ring-opacity-20 transition-all outline-none resize-none"
              />
            </div>

            {/* Package Weight */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⚖️ Package Weight (kg)
              </label>
              <div className="relative">
                <input
                  name="packageWeight"
                  value={form.packageWeight}
                  onChange={onChange}
                  placeholder="Enter weight in kg"
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0500FF] focus:ring-2 focus:ring-[#0500FF] focus:ring-opacity-20 transition-all outline-none pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  kg
                </span>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🚀 Delivery Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      form.deliveryType === type.value
                        ? "border-[#0500FF] bg-[#0500FF] bg-opacity-5 shadow-md"
                        : "border-gray-200 hover:border-[#0500FF] hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value={type.value}
                      checked={form.deliveryType === type.value}
                      onChange={onChange}
                      className="sr-only"
                    />
                    <span className="text-3xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-bold ${
                            form.deliveryType === type.value
                              ? "text-[#0500FF]"
                              : "text-gray-800"
                          }`}
                        >
                          {type.label}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            type.badge === "Popular"
                              ? "bg-[#FFD426] text-gray-800"
                              : "bg-[#FF3318] text-white"
                          }`}
                        >
                          {type.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{type.desc}</p>
                    </div>
                    {form.deliveryType === type.value && (
                      <svg
                        className="w-6 h-6 text-[#0500FF]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleFare}
                disabled={fareLoading}
                className="w-full py-3.5 px-4 bg-white border-2 border-[#0500FF] text-[#0500FF] rounded-lg font-bold hover:bg-[#0500FF] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {fareLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>💰 Get Fare Estimate</>
                )}
              </button>

              <button
                onClick={handleBook}
                disabled={loading || !fare}
                className="w-full py-3.5 px-4 bg-[#0500FF] text-white rounded-lg font-bold hover:bg-[#0400cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Booking...
                  </>
                ) : (
                  <>🚚 Confirm Booking</>
                )}
              </button>
            </div>

            {!fare && (
              <p className="text-xs text-center text-gray-500 mt-3">
                💡 Get fare estimate before confirming booking
              </p>
            )}
          </div>

          {/* Sidebar - Fare & Info */}
          <div className="space-y-6">
            {/* Fare Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                💰 Fare Estimate
              </h3>

              {fare ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#0500FF] to-[#16C9FF] rounded-xl p-6 text-white text-center">
                    <p className="text-sm opacity-90 mb-2">Total Amount</p>
                    <p className="text-4xl font-black">₹{fare}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Fare</span>
                      <span className="font-semibold">
                        ₹{Math.floor(fare * 0.7)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Distance Charge</span>
                      <span className="font-semibold">
                        ₹{Math.floor(fare * 0.2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span className="font-semibold">
                        ₹{Math.floor(fare * 0.1)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-[#0500FF]">
                      <span>Total</span>
                      <span>₹{fare}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💸</div>
                  <p className="text-gray-500 text-sm">
                    Fill the form and click "Get Fare Estimate" to see pricing
                  </p>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="bg-gradient-to-br from-[#0500FF] to-[#0D3483] rounded-xl p-6 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <span>⚡</span> Why Choose Pick4U?
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span>✓</span> Real-time tracking
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Secure packaging
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> 24/7 customer support
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Best price guarantee
                </li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="bg-[#FFD426] rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>💬</span> Need Help?
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Our support team is here to assist you
              </p>
              <button className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
