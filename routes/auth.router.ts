import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
  googleAuth,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/authMiddlewares";
import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "../validations";
import { authValidate } from "../middlewares/validate";

const router = express.Router();

router.post("/register", authValidate(registerSchema), register);
router.post("/login", authValidate(loginSchema), login);
router.post("/google", googleAuth);
router.post("/forgot-password", authValidate(forgotSchema), forgotPassword);
router.post("/reset-password/:token", authValidate(resetSchema), resetPassword);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);
export default router;
