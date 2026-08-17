import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
} from "../controllers/productController";
import upload from "../middlewares/upload";
const router = express.Router();

router.route("/").post(upload.single("product_image"), createProduct);
router.route("/:id").get(getProduct);
// router.route('/:id').patch().delete()

export default router;
