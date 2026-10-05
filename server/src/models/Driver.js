import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // linked with User table
    availability: { type: Boolean, default: true },
    kycDocs: [{ type: String }], // file paths
    kycStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
