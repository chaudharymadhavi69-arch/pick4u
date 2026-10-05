// src/utils/fareCalc.js

// simple fare calc: base + perKm + perKg
export function calculateFare({
  distanceKm = 1,
  weightKg = 1,
  deliveryType = "standard",
}) {
  const base = 30; // base fee in currency units
  const perKm = 10; // per km
  const perKg = 5; // per kg

  let typeMultiplier = 1;
  if (deliveryType === "instant") typeMultiplier = 2.0;
  else if (deliveryType === "same-day") typeMultiplier = 1.3;

  const fare = (base + perKm * distanceKm + perKg * weightKg) * typeMultiplier;
  return Math.round(fare); // integer
}
