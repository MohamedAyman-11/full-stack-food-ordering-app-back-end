import express from "express";
import {
  signup,
  login,
  getCurrentUser,
  logout,
  googleAuth,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddlewares";
const router = express.Router();
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);
router.post("/google", googleAuth);
export default router;
