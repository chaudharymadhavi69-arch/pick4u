// src/routes/customer.js
import express from "express";
import {
  getProfile,
  updateProfile,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  fareEstimate,
  applyCoupon,
  removeCoupon,
} from "../controllers/customerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.use(authMiddleware);

// ---------------- Profile ----------------
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// ---------------- Orders ----------------
router.post("/orders", createOrder); // Create new order
router.get("/orders", getMyOrders); // Get all my orders
router.get("/orders/:id", getOrderById); // Get single order
router.put("/orders/:id/cancel", cancelOrder); // Cancel order

// ---------------- Fare & Coupons ----------------
router.post("/fare-estimate", fareEstimate); // Calculate fare estimate
router.post("/apply-coupon", applyCoupon); // Apply coupon
router.post("/remove-coupon", removeCoupon); // Remove coupon

export default router;
