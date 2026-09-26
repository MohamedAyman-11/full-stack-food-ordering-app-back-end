import express from "express";
import { protect } from "../middlewares/authMiddlewares";
import {
  createCheckoutSession,
  createOrder,
  getCheckoutSuccess,
  getMyOrders,
  getOrder,
} from "../controllers/order.controller";

import { validate } from "../middlewares/validate";
import { orderSchema } from "../validations";

const router = express.Router();

router
  .route("/")
  .post(protect, validate(orderSchema), createOrder)
  .get(protect, getMyOrders);

router.get("/checkout-success", protect, getCheckoutSuccess);

router.post("/:id/checkout", protect, createCheckoutSession);

router.route("/:id").get(protect, getOrder);

export default router;
