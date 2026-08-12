import express from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/categoriesController";
import upload from "../middlewares/upload";
const router = express.Router();
router
  .route("/")
  .get(getAllCategories)
  .post(upload.single("category_image"), createCategory);
export default router;
