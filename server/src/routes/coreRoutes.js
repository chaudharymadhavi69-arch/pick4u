import express from "express";
import {
  getDistance,
  getFare,
  sendSms,
  sendEmail,
  sendPush,
  refundPayment,
} from "../controllers/coreController.js"; // ⚠️ file name match

const router = express.Router();

// Distance & Fare
router.post("/distance", getDistance);
router.post("/fare", getFare);

// Notifications
router.post("/notify/sms", sendSms);
router.post("/notify/email", sendEmail);
router.post("/notify/push", sendPush);

// Payment Refund
router.post("/payment/refund", refundPayment);

export default router;
