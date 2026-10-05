import mongoose from "mongoose";

const fareConfigSchema = new mongoose.Schema(
  {
    baseFare: { type: Number, default: 50 }, // default base charge
    perKmRate: { type: Number, default: 8 }, // per kilometer
    perKgRate: { type: Number, default: 10 }, // per kilogram
    instantDeliveryFee: { type: Number, default: 50 }, // extra for instant delivery
    sameDayDeliveryFee: { type: Number, default: 30 }, // extra for same-day
    zonePricing: [
      {
        zone: String, // e.g., "Delhi-NCR"
        rate: Number, // special zone-based rate
      },
    ],
    peakHourMultiplier: { type: Number, default: 1.0 }, // surge pricing
  },
  { timestamps: true }
);

export default mongoose.model("FareConfig", fareConfigSchema);
