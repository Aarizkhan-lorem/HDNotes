import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getMe,
  resendOTP,
} from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);

// Protected routes
router.use(protect); // All routes below this middleware are protected
router.get("/me", getMe);
router.post("/logout", logout);

export default router;
