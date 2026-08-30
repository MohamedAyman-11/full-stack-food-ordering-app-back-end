import express from "express";
import {
  createExtra,
  deleteExtra,
  getExtras,
  updateExtra,
} from "../controllers/extraController";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
import { validate } from "../middlewares/validate";
import { extraSchema } from "../validations";

const router = express.Router();
router
  .route("/")
  .get(getExtras)
  .post(protect, restrictTo("admin"), validate(extraSchema), createExtra);
router
  .route("/:id")
  .patch(protect, restrictTo("admin"), validate(extraSchema), updateExtra)
  .delete(protect, restrictTo("admin"), deleteExtra);
export default router;
