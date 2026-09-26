import express from "express";
import { protect, restrictTo } from "../middlewares/authMiddlewares";
import {
  assignDeliveryBoyToOrder,
  changeDeliveryPartnerStatus,
  deleteUser,
  getActiveDeliveryPartners,
  getDeliveryPartners,
  getOrders,
  getProducts,
  getUser,
  getUsers,
  updateUserProfile,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate";
import {
  assignDeliveryBoyToOrderSchema,
  updateDeliveryPartnerStatus,
  updateUserProfileSchema,
} from "../validations";
import upload from "../middlewares/upload";
const router = express.Router();

router.use(protect, restrictTo("admin"));

// USERS
router.get("/users", protect, restrictTo("admin"), getUsers);

router
  .route("/users/:id")
  .get(getUser)
  .patch(
    upload.single("user_image"),
    validate(updateUserProfileSchema),
    updateUserProfile,
  )
  .delete(deleteUser);

router.get("/products", protect, restrictTo("admin"), getProducts);

// ORDERS
router.get("/orders", protect, restrictTo("admin"), getOrders);

router.patch(
  "/orders/:orderId/assign-delivery-boy",
  protect,
  restrictTo("admin"),
  validate(assignDeliveryBoyToOrderSchema),
  assignDeliveryBoyToOrder,
);

// DELIVERY PARTNER
router.get(
  "/delivery-partners",
  protect,
  restrictTo("admin"),
  getDeliveryPartners,
);

router.get(
  "/active-delivery-partners",
  protect,
  restrictTo("admin"),
  getActiveDeliveryPartners,
);

router.patch(
  "/delivery-partners/:id/status",
  protect,
  restrictTo("admin"),
  validate(updateDeliveryPartnerStatus),
  changeDeliveryPartnerStatus,
);

export default router;
