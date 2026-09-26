import express from "express";
import { validate } from "../middlewares/validate";
import { changePasswordSchema, updateProfileSchema } from "../validations";
import { protect } from "../middlewares/authMiddlewares";
import { updatePassword, updateProfile } from "../controllers/user.controller";
import upload from "../middlewares/upload";
const router = express.Router();
router.patch(
  "/me",
  protect,
  upload.single("user_image"),
  validate(updateProfileSchema),
  updateProfile,
);
router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  updatePassword,
);
export default router;
