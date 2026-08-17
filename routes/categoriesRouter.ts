import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithProducts,
  updateCategory,
} from "../controllers/categoriesController";
import upload from "../middlewares/upload";
const router = express.Router();
router
  .route("/")
  .get(getCategories)
  .post(upload.single("category_image"), createCategory);
router.get("/with-products", getCategoriesWithProducts);
router
  .route("/:id")
  .patch(upload.single("category_image"), updateCategory)
  .delete(deleteCategory);
export default router;
