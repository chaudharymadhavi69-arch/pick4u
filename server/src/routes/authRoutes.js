import express from "express";
import {
  registerController,
  loginController,
  customerProtected,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerController);
router.post("/login", loginController);

// Protected (Customer only)
router.get("/customer-dashboard", authMiddleware, customerProtected);

export default router;
