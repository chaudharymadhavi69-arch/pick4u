import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FareCalculator from "../../components/customer/FareCalculator";
import axios from "axios";
import {
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const NewOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
    fare: "",
  });
  const [loading, setLoading] = useState(false);
  const [calculatedFare, setCalculatedFare] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFareCalculated = (fareData) => {
    setCalculatedFare(fareData);
    setFormData((prev) => ({
      ...prev,
      fare: fareData.fare,
    }));
  };

  const createOrder = async () => {
    if (!calculatedFare) {
      alert("Please calculate fare first");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://pick4u-yyco.onrender.com/api/customer/orders",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order created successfully!");
      navigate("/customer/orders");
    } catch (error) {
      alert(
        "Error creating order: " +
          (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const deliveryOptions = [
    {
      value: "standard",
      label: "Standard",
      time: "2-3 days",
      icon: Package,
      color: "#18CFFF",
    },
    {
      value: "express",
      label: "Express",
      time: "24 hours",
      icon: Truck,
      color: "#FF7000",
    },
    {
      value: "same-day",
      label: "Same Day",
      time: "Today",
      icon: Clock,
      color: "#FF0420",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Gradient */}
      <div className="relative bg-gradient-to-br from-[#0500FF] to-black text-white py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#18CFFF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FF7000] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Create New Delivery</h1>
          </div>
          <p className="text-white/80 text-lg">
            Fast, reliable delivery at your fingertips
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="space-y-6">
              {/* Address Section */}
              <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 hover:border-[#0500FF] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0500FF] to-[#18CFFF] rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Delivery Locations
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
                      Pickup Address *
                    </label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black"
                      placeholder="Enter complete pickup address with landmarks"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -my-2 z-10">
                      <div className="w-8 h-8 bg-[#FF7000] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
                      Delivery Address *
                    </label>
                    <textarea
                      name="dropAddress"
                      value={formData.dropAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black"
                      placeholder="Enter complete delivery address with landmarks"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 hover:border-[#0500FF] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF0420] to-[#DB4483] rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-black">
                    Package Details
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
                    Package Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="packageWeight"
                    value={formData.packageWeight}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    max="50"
                    className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black text-lg font-semibold"
                    placeholder="0.5"
                    required
                  />
                </div>
              </div>

              {/* Delivery Type */}
              <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 hover:border-[#0500FF] transition-all duration-300">
                <label className="block text-sm font-semibold text-[#929292] mb-4 uppercase tracking-wide">
                  Delivery Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {deliveryOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            deliveryType: option.value,
                          })
                        }
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.deliveryType === option.value
                            ? "border-[#0500FF] bg-[#0500FF]/5"
                            : "border-[#E3E3E3] hover:border-[#C2C2C2]"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${option.color}15` }}
                          >
                            <Icon
                              className="w-6 h-6"
                              style={{ color: option.color }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-black text-sm">
                              {option.label}
                            </div>
                            <div className="text-xs text-[#929292]">
                              {option.time}
                            </div>
                          </div>
                        </div>
                        {formData.deliveryType === option.value && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-[#0500FF]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Fare */}
              {calculatedFare && (
                <div className="bg-gradient-to-br from-[#0500FF] to-[#18CFFF] rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold opacity-90 mb-1">
                        Total Fare
                      </h4>
                      <p className="text-3xl font-bold">
                        ₹{calculatedFare.fare}
                      </p>
                      <p className="text-sm opacity-80 mt-1">
                        Distance: {calculatedFare.distance} km
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              )}

              {/* Create Order Button */}
              <button
                onClick={createOrder}
                disabled={loading || !calculatedFare}
                className="w-full bg-gradient-to-r from-[#0500FF] to-black text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#0500FF]/30 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300"
              >
                {loading ? "Creating Order..." : "Create Order Now"}
              </button>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Fare Calculator */}
              <FareCalculator onFareCalculated={handleFareCalculated} />

              {/* Instructions Card */}
              <div className="bg-gradient-to-br from-[#FF7000]/10 to-[#FF0420]/10 border-2 border-[#FF7000]/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FF7000] rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-black">
                    Important Instructions
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Fill all address details accurately",
                    "Calculate fare before creating order",
                    "Ensure package weight is correct",
                    "Choose appropriate delivery type",
                    "Driver will contact you for pickup",
                  ].map((instruction, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[#929292]"
                    >
                      <div className="w-6 h-6 bg-[#FF7000] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#18CFFF]/10 border border-[#18CFFF]/30 rounded-xl p-4">
                  <div className="w-8 h-8 bg-[#18CFFF] rounded-lg flex items-center justify-center mb-2">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-black">Fast Delivery</p>
                  <p className="text-xs text-[#929292] mt-1">
                    On-time guaranteed
                  </p>
                </div>
                <div className="bg-[#0500FF]/10 border border-[#0500FF]/30 rounded-xl p-4">
                  <div className="w-8 h-8 bg-[#0500FF] rounded-lg flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-bold text-black">Safe & Secure</p>
                  <p className="text-xs text-[#929292] mt-1">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewOrder;
