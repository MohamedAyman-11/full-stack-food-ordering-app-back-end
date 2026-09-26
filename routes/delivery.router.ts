import express from "express";
import {
  protect,
  protectDelivery,
  restrictTo,
} from "../middlewares/authMiddlewares";
import { authValidate, validate } from "../middlewares/validate";
import {
  deliveryLoginSchema,
  deliveryRegisterSchema,
  updateOrderStatusSchema,
  completeOrderSchema,
} from "../validations";
import {
  getCurrentDeliveryBoy,
  getMyOrders,
  login,
  logout,
  signup,
  updateOrderStatus,
  completeOrder,
  cancelOrder,
} from "../controllers/delivery.controller";
const router = express.Router();

router.post(
  "/register",
  protect,
  restrictTo("admin"),
  authValidate(deliveryRegisterSchema),
  signup,
);

router.post("/login", authValidate(deliveryLoginSchema), login);

router.post("/logout", protectDelivery, logout);

router.get("/me", protectDelivery, getCurrentDeliveryBoy);

router.get("/orders", protectDelivery, getMyOrders);

router.patch(
  "/orders/:id/complete",
  protectDelivery,
  validate(completeOrderSchema),
  completeOrder,
);

router.patch(
  "/orders/:id/status",
  protectDelivery,
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

router.patch("/orders/:id/cancel", protectDelivery, cancelOrder);
export default router;
