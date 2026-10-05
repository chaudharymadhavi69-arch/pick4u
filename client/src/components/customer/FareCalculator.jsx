import React, { useState } from "react";
import axios from "axios";
import {
  Calculator,
  MapPin,
  Package,
  Zap,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const FareCalculator = ({ onFareCalculated }) => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropAddress: "",
    packageWeight: "",
    deliveryType: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateFare = async () => {
    if (
      !formData.pickupAddress ||
      !formData.dropAddress ||
      !formData.packageWeight
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://pick4u-yyco.onrender.com/api/customer/fare-estimate",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFare(response.data);
      if (onFareCalculated) {
        onFareCalculated(response.data);
      }
    } catch (error) {
      alert("Error calculating fare");
    } finally {
      setLoading(false);
    }
  };

  const deliveryTypes = [
    { value: "standard", label: "Standard", icon: Package, color: "#18CFFF" },
    { value: "express", label: "Express", icon: Zap, color: "#FF7000" },
    {
      value: "same-day",
      label: "Same Day",
      icon: TrendingUp,
      color: "#FF0420",
    },
  ];

  return (
    <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 hover:border-[#0500FF] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#0500FF] to-[#18CFFF] rounded-xl flex items-center justify-center shadow-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Fare Calculator</h3>
          <p className="text-xs text-[#929292]">Get instant fare estimate</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Pickup Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
            <MapPin className="w-4 h-4 text-[#0500FF]" />
            Pickup Location
          </label>
          <textarea
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black text-sm resize-none"
            placeholder="Enter pickup address"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
            <MapPin className="w-4 h-4 text-[#FF0420]" />
            Delivery Location
          </label>
          <textarea
            name="dropAddress"
            value={formData.dropAddress}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black text-sm resize-none"
            placeholder="Enter delivery address"
          />
        </div>

        {/* Package Weight & Delivery Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
              <Package className="w-4 h-4 text-[#FF7000]" />
              Weight
            </label>
            <div className="relative">
              <input
                type="number"
                name="packageWeight"
                value={formData.packageWeight}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black font-semibold"
                placeholder="5.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#929292] text-sm font-semibold">
                kg
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
              Type
            </label>
            <select
              name="deliveryType"
              value={formData.deliveryType}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black font-semibold appearance-none bg-white cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23929292'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25rem",
              }}
            >
              {deliveryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateFare}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0500FF] to-[#18CFFF] text-white py-3.5 px-4 rounded-xl hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#0500FF]/30 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calculate Fare
            </>
          )}
        </button>

        {/* Fare Result */}
        {fare && (
          <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0500FF] to-[#18CFFF] opacity-10 animate-pulse"></div>

            {/* Content */}
            <div className="relative bg-gradient-to-br from-[#0500FF] to-[#000000] rounded-2xl p-6 shadow-2xl border-2 border-[#0500FF]/20">
              {/* Success Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">
                  Fare Calculated
                </span>
              </div>

              {/* Fare Amount */}
              <div className="mb-4">
                <p className="text-white/70 text-sm font-semibold mb-1">
                  Total Amount
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    ₹{fare.fare}
                  </span>
                  <span className="text-white/60 text-lg">.00</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs font-semibold mb-1">
                    Distance
                  </p>
                  <p className="text-white text-lg font-bold">
                    {fare.distance} km
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <p className="text-white/70 text-xs font-semibold mb-1">
                    Delivery Type
                  </p>
                  <p className="text-white text-lg font-bold capitalize">
                    {fare.deliveryType}
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-[#18CFFF] rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#FF7000] rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        )}

        {/* Info Badge */}
        {!fare && (
          <div className="bg-gradient-to-r from-[#18CFFF]/10 to-[#0500FF]/10 border border-[#18CFFF]/30 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-[#18CFFF] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-black mb-1">
                Quick Estimate
              </p>
              <p className="text-xs text-[#929292] leading-relaxed">
                Fill in the details above and click calculate to get an instant
                fare estimate for your delivery.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareCalculator;

// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Calculator,
//   MapPin,
//   Package,
//   Zap,
//   TrendingUp,
//   CheckCircle2,
//   Navigation,
//   Scale,
//   Clock,
// } from "lucide-react";

// const FareCalculator = ({ onFareCalculated }) => {
//   const [formData, setFormData] = useState({
//     pickupAddress: "",
//     dropAddress: "",
//     packageWeight: "",
//     deliveryType: "standard",
//   });
//   const [loading, setLoading] = useState(false);
//   const [fare, setFare] = useState(null);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     // Clear previous results when inputs change
//     if (fare || error) {
//       setFare(null);
//       setError("");
//     }
//   };

//   const calculateFare = async () => {
//     if (!formData.pickupAddress.trim() || !formData.dropAddress.trim()) {
//       setError("Please enter both pickup and delivery addresses");
//       return;
//     }

//     if (!formData.packageWeight || parseFloat(formData.packageWeight) <= 0) {
//       setError("Please enter a valid package weight");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "https://pick4u-yyco.onrender.com/api/customer/fare-estimate",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         setFare(response.data);
//         if (onFareCalculated) {
//           onFareCalculated(response.data);
//         }
//       } else {
//         setError("Failed to calculate fare. Please try again.");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message ||
//                           "Failed to calculate fare. Please check the addresses and try again.";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deliveryTypes = [
//     {
//       value: "standard",
//       label: "Standard",
//       icon: Package,
//       color: "#18CFFF",
//       description: "2-3 days"
//     },
//     {
//       value: "express",
//       label: "Express",
//       icon: Zap,
//       color: "#FF7000",
//       description: "24 hours"
//     },
//     {
//       value: "same-day",
//       label: "Same Day",
//       icon: TrendingUp,
//       color: "#FF0420",
//       description: "Today"
//     },
//   ];

//   return (
//     <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl p-6 hover:border-[#0500FF] transition-all duration-300">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-12 h-12 bg-gradient-to-br from-[#0500FF] to-[#18CFFF] rounded-xl flex items-center justify-center shadow-lg">
//           <Calculator className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-black">Real-Time Fare Calculator</h3>
//           <p className="text-xs text-[#929292]">Live distance-based pricing</p>
//         </div>
//       </div>

//       <div className="space-y-5">
//         {/* Pickup Address */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
//             <MapPin className="w-4 h-4 text-[#0500FF]" />
//             Pickup Location *
//           </label>
//           <textarea
//             name="pickupAddress"
//             value={formData.pickupAddress}
//             onChange={handleChange}
//             rows="2"
//             className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black text-sm resize-none"
//             placeholder="Enter complete pickup address with landmarks"
//             required
//           />
//         </div>

//         {/* Delivery Address */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
//             <MapPin className="w-4 h-4 text-[#FF0420]" />
//             Delivery Location *
//           </label>
//           <textarea
//             name="dropAddress"
//             value={formData.dropAddress}
//             onChange={handleChange}
//             rows="2"
//             className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black text-sm resize-none"
//             placeholder="Enter complete delivery address with landmarks"
//             required
//           />
//         </div>

//         {/* Package Weight & Delivery Type */}
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="flex items-center gap-2 text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
//               <Package className="w-4 h-4 text-[#FF7000]" />
//               Weight (kg) *
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 name="packageWeight"
//                 value={formData.packageWeight}
//                 onChange={handleChange}
//                 step="0.1"
//                 min="0.1"
//                 max="50"
//                 className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black font-semibold"
//                 placeholder="0.5"
//                 required
//               />
//               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#929292] text-sm font-semibold">
//                 kg
//               </span>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-[#929292] mb-2 uppercase tracking-wide">
//               Delivery Type
//             </label>
//             <select
//               name="deliveryType"
//               value={formData.deliveryType}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border-2 border-[#E3E3E3] rounded-xl focus:outline-none focus:border-[#0500FF] transition-all duration-200 text-black font-semibold appearance-none bg-white cursor-pointer"
//               style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23929292'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 0.75rem center",
//                 backgroundSize: "1.25rem",
//               }}
//             >
//               {deliveryTypes.map((type) => (
//                 <option key={type.value} value={type.value}>
//                   {type.label} ({type.description})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//             <p className="text-red-700 text-sm font-medium">{error}</p>
//           </div>
//         )}

//         {/* Calculate Button */}
//         <button
//           onClick={calculateFare}
//           disabled={loading}
//           className="w-full bg-gradient-to-r from-[#0500FF] to-[#18CFFF] text-white py-3.5 px-4 rounded-xl hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-[#0500FF]/30 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//               Calculating Real-Time Fare...
//             </>
//           ) : (
//             <>
//               <Navigation className="w-5 h-5" />
//               Calculate Live Fare
//             </>
//           )}
//         </button>

//         {/* Fare Result */}
//         {fare && (
//           <div className="relative overflow-hidden">
//             <div className="relative bg-gradient-to-br from-[#0500FF] to-[#000000] rounded-2xl p-6 shadow-2xl border-2 border-[#0500FF]/20">
//               {/* Success Badge */}
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                   <CheckCircle2 className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-white/90 text-sm font-semibold uppercase tracking-wide">
//                   Real-Time Fare Calculated
//                 </span>
//               </div>

//               {/* Fare Amount */}
//               <div className="mb-4">
//                 <p className="text-white/70 text-sm font-semibold mb-1">
//                   Total Amount
//                 </p>
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-5xl font-bold text-white">
//                     ₹{fare.fare}
//                   </span>
//                   <span className="text-white/60 text-lg">.00</span>
//                 </div>
//               </div>

//               {/* Details Grid */}
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Navigation className="w-4 h-4 text-white/70" />
//                     <p className="text-white/70 text-xs font-semibold">Distance</p>
//                   </div>
//                   <p className="text-white text-lg font-bold">
//                     {fare.distance} km
//                   </p>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Clock className="w-4 h-4 text-white/70" />
//                     <p className="text-white/70 text-xs font-semibold">Delivery</p>
//                   </div>
//                   <p className="text-white text-lg font-bold capitalize">
//                     {fare.deliveryType}
//                   </p>
//                 </div>
//               </div>

//               {/* Fare Breakdown */}
//               <div className="bg-white/5 rounded-xl p-4 border border-white/10">
//                 <p className="text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">
//                   Fare Breakdown
//                 </p>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-white/70">Base Fare:</span>
//                     <span className="text-white">₹50</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-white/70">Distance ({fare.distance} km × ₹8):</span>
//                     <span className="text-white">₹{Math.round(fare.distance * 8)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-white/70">Delivery Type:</span>
//                     <span className="text-white capitalize">{fare.deliveryType}</span>
//                   </div>
//                   <div className="border-t border-white/20 pt-2 mt-2">
//                     <div className="flex justify-between font-bold">
//                       <span className="text-white">Total:</span>
//                       <span className="text-white">₹{fare.fare}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Decorative Elements */}
//               <div className="absolute top-4 right-4 w-20 h-20 bg-[#18CFFF] rounded-full blur-3xl opacity-30"></div>
//               <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#FF7000] rounded-full blur-3xl opacity-20"></div>
//             </div>
//           </div>
//         )}

//         {/* Pricing Info */}
//         {!fare && !error && (
//           <div className="bg-gradient-to-r from-[#18CFFF]/10 to-[#0500FF]/10 border border-[#18CFFF]/30 rounded-xl p-4">
//             <p className="text-sm font-semibold text-black mb-2">Pricing Structure</p>
//             <div className="space-y-1 text-xs text-[#929292]">
//               <div className="flex justify-between">
//                 <span>Base Fare:</span>
//                 <span className="font-semibold">₹50</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Distance Rate:</span>
//                 <span className="font-semibold">₹8/km</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Weight (first 5kg free):</span>
//                 <span className="font-semibold">₹10/kg extra</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Express Delivery:</span>
//                 <span className="font-semibold">+50%</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Same Day Delivery:</span>
//                 <span className="font-semibold">+100%</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FareCalculator;
