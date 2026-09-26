import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesWithProducts,
  getCategory,
  getCategoryOptions,
  updateCategory,
} from "../controllers/categories.controller";
import upload from "../middlewares/upload";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
import { validate } from "../middlewares/validate";
import { createCategorySchema, updateCategorySchema } from "../validations";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    restrictTo("admin"),
    upload.single("category_image"),
    validate(createCategorySchema),
    createCategory,
  );

router.get("/with-products", getCategoriesWithProducts);
router.get("/:id/options", protect, restrictTo("admin"), getCategoryOptions);
router
  .route("/:id")
  .get(protect, restrictTo("admin"), getCategory)
  .patch(
    protect,
    restrictTo("admin"),
    upload.single("category_image"),
    validate(updateCategorySchema),
    updateCategory,
  )
  .delete(protect, restrictTo("admin"), deleteCategory);

export default router;
