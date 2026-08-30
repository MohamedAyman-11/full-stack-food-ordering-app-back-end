import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUserProfile,
} from "../controllers/adminController";
import { validate } from "../middlewares/validate";
import { updateUserProfileSchema } from "../validations";
import upload from "../middlewares/upload";
const router = express.Router();

router.use(protect, restrictTo("admin"));
router.get("/users", getUsers);
router
  .route("/users/:id")
  .get(getUser)
  .patch(
    upload.single("user_image"),
    validate(updateUserProfileSchema),
    updateUserProfile,
  )
  .delete(deleteUser);
export default router;
