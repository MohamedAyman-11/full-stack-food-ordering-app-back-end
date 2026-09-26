import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSeller,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import upload from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { ProductSchema } from "../validations";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    restrictTo("admin"),
    upload.single("product_image"),
    validate(ProductSchema),
    createProduct,
  );

router.get("/best-seller", getBestSeller);
router.route("/:id").get(getProduct);
router
  .route("/:id")
  .delete(protect, restrictTo("admin"), deleteProduct)
  .patch(
    protect,
    restrictTo("admin"),
    upload.single("product_image"),
    validate(ProductSchema),
    updateProduct,
  );

export default router;
