import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  logout,
  googleAuth,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddlewares";
import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "../validations";
import { authValidate } from "../middlewares/validate";
const router = express.Router();
router.post("/login", authValidate(loginSchema), login);
router.post("/signup", authValidate(registerSchema), signup);
router.post("/google", googleAuth);
router.post("/forgot-password", authValidate(forgotSchema), forgotPassword);
router.post("/reset-password/:token", authValidate(resetSchema), resetPassword);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);
export default router;
