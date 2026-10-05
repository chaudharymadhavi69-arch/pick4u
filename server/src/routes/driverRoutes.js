import express from "express";
import {
  kycUploadController,
  getDriverProfile,
  updateProfile,
  getDriverEarnings,
  getAssignedJobs,
  acceptJob,
  rejectJob,
  uploadProof,
  getReports,
  getPendingOrders,
  getAllOrdersForDriver,
  markArrived,
  markPickedUp,
  markOnTheWay,
  markDelivered,
} from "../controllers/driverController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadKyc } from "../middleware/multer.js";

const router = express.Router();

// ✅ All routes are protected
router.use(authMiddleware);

// ------------------- KYC -------------------
router.post("/kyc", uploadKyc.array("docs", 5), kycUploadController);

// ------------------- Driver Profile -------------------
router.get("/profile", getDriverProfile);
router.put("/profile", updateProfile);

// ------------------- Earnings & Reports -------------------
router.get("/earnings", getDriverEarnings);
router.get("/jobs", getAssignedJobs);
router.get("/reports", getReports);
router.get("/my-earnings", getDriverEarnings);

// ------------------- Jobs -------------------
router.post("/jobs/:id/accept", acceptJob);
router.post("/jobs/:id/reject", rejectJob);

// ------------------- Delivery Status Updates -------------------
router.put("/jobs/:id/arrived", markArrived);
router.put("/jobs/:id/picked-up", markPickedUp);
router.put("/jobs/:id/on-the-way", markOnTheWay);
router.put("/jobs/:id/delivered", markDelivered);

// ------------------- Proof Upload -------------------
router.post("/jobs/:id/proof", uploadProof);

// ------------------- Orders -------------------
router.get("/orders/pending", getPendingOrders);
router.get("/orders/all", getAllOrdersForDriver);

export default router;
