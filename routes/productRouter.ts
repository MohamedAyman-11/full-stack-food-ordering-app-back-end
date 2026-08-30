import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../controllers/productController";
import upload from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { ProductSchema } from "../validations";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("admin"), getAllProducts)
  .post(
    protect,
    restrictTo("admin"),
    upload.single("product_image"),
    validate(ProductSchema),
    createProduct,
  );
router.route("/:id").get(getProduct);
router.route("/:id").delete(protect, restrictTo("admin"), deleteProduct);

export default router;
