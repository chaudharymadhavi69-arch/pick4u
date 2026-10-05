import React, { useEffect, useState } from "react";
import { getFareConfig, updateFareConfig } from "../../api";

export default function Fares() {
  const [config, setConfig] = useState({ baseFare: 0, perKm: 0, perKg: 0 });

  useEffect(() => {
    getFareConfig().then((res) => setConfig(res.data));
  }, []);

  const handleSave = async () => {
    await updateFareConfig(config);
    alert("Fare config updated");
  };

  return (
    <div className="p-6 max-w-md space-y-4">
      <h2 className="text-xl font-bold">Fare Configuration</h2>
      <input
        type="number"
        value={config.baseFare}
        onChange={(e) => setConfig({ ...config, baseFare: e.target.value })}
        className="w-full border p-2 rounded"
        placeholder="Base Fare"
      />
      <input
        type="number"
        value={config.perKm}
        onChange={(e) => setConfig({ ...config, perKm: e.target.value })}
        className="w-full border p-2 rounded"
        placeholder="Per Km"
      />
      <input
        type="number"
        value={config.perKg}
        onChange={(e) => setConfig({ ...config, perKg: e.target.value })}
        className="w-full border p-2 rounded"
        placeholder="Per Kg"
      />
      <button
        onClick={handleSave}
        className="w-full bg-sky-600 text-white py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
