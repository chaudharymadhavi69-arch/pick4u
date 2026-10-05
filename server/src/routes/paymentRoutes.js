// // src/routes/paymentRoutes.js
// import express from "express";
// import {
//   createPayment,
//   verifyPayment,
//   getMyPayments,
// } from "../controllers/paymentController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // All routes need authentication
// router.use(authMiddleware);

// // POST /api/payments → create new payment (Razorpay)
// router.post("/", createPayment);

// // POST /api/payments/verify → verify payment signature
// router.post("/verify", verifyPayment);

// // GET /api/payments/me → get payments of logged-in user
// router.get("/me", getMyPayments);

// export default router;
