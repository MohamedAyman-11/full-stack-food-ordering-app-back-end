import express from "express";
import {
  createSize,
  getSizes,
  deleteSize,
  updateSize,
} from "../controllers/size.controller";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
import { validate } from "../middlewares/validate";
import { SizeSchema } from "../validations";

const router = express.Router();
router
  .route("/")
  .get(getSizes)
  .post(protect, restrictTo("admin"), validate(SizeSchema), createSize);
router
  .route("/:id")
  .delete(protect, restrictTo("admin"), deleteSize)
  .patch(protect, restrictTo("admin"), validate(SizeSchema), updateSize);
export default router;
