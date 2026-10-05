import React, { useState } from "react";
import { getDistance } from "../../api"; // <-- yaha change

export default function DistanceCalculator() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await getDistance({
        pickupAddress: pickup,
        dropAddress: drop,
      });
      setDistance(res.data.distance);
    } catch (err) {
      console.error("Error fetching distance", err);
    }
  };

  return (
    <div>
      <input
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        placeholder="Pickup Address"
      />
      <input
        value={drop}
        onChange={(e) => setDrop(e.target.value)}
        placeholder="Drop Address"
      />
      <button onClick={handleCalculate}>Calculate</button>
      {distance !== null && <p>Distance: {distance} km</p>}
    </div>
  );
}
