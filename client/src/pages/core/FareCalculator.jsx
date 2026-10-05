import React, { useState } from "react";
import { getFare } from "../../api"; // <-- yaha change

export default function FareCalculator() {
  const [distance, setDistance] = useState("");
  const [weight, setWeight] = useState("");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [fare, setFare] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await getFare({ distance, weight, deliveryType });
      setFare(res.data.fare);
    } catch (err) {
      console.error("Error fetching fare", err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Fare Calculator</h2>
      <input
        type="number"
        placeholder="Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <select
        value={deliveryType}
        onChange={(e) => setDeliveryType(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="standard">Standard</option>
        <option value="same-day">Same Day</option>
        <option value="instant">Instant</option>
      </select>
      <button
        onClick={handleCalculate}
        className="bg-sky-600 text-white w-full py-2 rounded"
      >
        Calculate Fare
      </button>
      {fare !== null && <p className="mt-2">Estimated Fare: ₹{fare}</p>}
    </div>
  );
}
