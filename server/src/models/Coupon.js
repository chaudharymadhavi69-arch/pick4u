import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // ek hi coupon code bar-bar na bane
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage"], // fixed ₹ off ya % off
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0, // minimum order amount required
    },
    maxDiscount: {
      type: Number, // only for percentage coupons
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, // kitni baar use ho skta h
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
