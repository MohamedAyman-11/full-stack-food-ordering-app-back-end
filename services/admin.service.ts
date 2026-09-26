import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import uploadImage from "../utils/uploadImage";
import {
  OrderQuerySchemaType,
  ProductQuerySchemaType,
  UpdateUserProfileType,
} from "../validations";
import { JsonNull } from "../generated/prisma/internal/prismaNamespace";
import { deleteImage } from "../utils/deleteImage";
import crypto from "crypto";
export const getUsersService = async () => {
  const users = await db.user.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return users;
};

type DeleteUser = {
  userId: string;
};

export const deleteUserService = async ({ userId }: DeleteUser) => {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }
  await db.user.delete({ where: { id: userId } });
};

export const getUserService = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }
  return user;
};

type UpdateUser = {
  data: UpdateUserProfileType;
  id: string;
  buffer?: Buffer;
};

type UserImage = {
  url: string;
  public_id: string;
};

export const updateUserService = async ({ data, buffer, id }: UpdateUser) => {
  const existingUser = await db.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }

  const oldImage = existingUser?.picture as UserImage | null;
  let image: UserImage | undefined;

  if (buffer) {
    const { url, public_id } = await uploadImage(buffer, "Users");
    image = { url, public_id };
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: {
      firstName: data.firstName || existingUser.firstName,
      lastName: data.lastName || existingUser.lastName,
      primaryPhone: data.primaryPhone || existingUser.primaryPhone,
      secondaryPhone: data.secondaryPhone || existingUser.secondaryPhone,
      city: data.city || existingUser.city,
      country: data.country || existingUser.country,
      postalCode: data.postalCode || existingUser.postalCode,
      street: data.street || existingUser.street,
      picture: image ? image : oldImage ? oldImage : JsonNull,
      role: data.isAdmin ? "ADMIN" : "CUSTOMER",
    },
  });

  if (buffer && oldImage?.public_id) {
    await deleteImage(oldImage.public_id);
  }
  return updatedUser;
};

type GetAdminProducts = {
  query: ProductQuerySchemaType;
};
export const getProductsService = async ({ query }: GetAdminProducts) => {
  const page = query.page ?? 1;
  const take = query.limit ?? 6;
  const skip = (page - 1) * take;

  const [products, count] = await Promise.all([
    db.product.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take,
      skip,
    }),
    db.product.count(),
  ]);
  return { products, count };
};

export const getDeliveryPartnersService = async () => {
  const deliveryPartners = await db.deliveryBoy.findMany({
    orderBy: { createdAt: "desc" },
    omit: { password: true },
  });
  return deliveryPartners;
};

export const getActiveDeliveryPartnersService = async () => {
  const deliveryPartners = await db.deliveryBoy.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    omit: { password: true },
  });
  return deliveryPartners;
};

type ChangeDeliveryPartnerStatus = {
  deliveryId: string;
  newStatus: "ACTIVE" | "INACTIVE";
};

export const changeDeliveryPartnerStatusService = async ({
  deliveryId,
  newStatus,
}: ChangeDeliveryPartnerStatus) => {
  const deliveryPartner = await db.deliveryBoy.findUnique({
    where: { id: deliveryId },
  });

  if (!deliveryPartner) {
    throw new AppError({
      statusCode: 404,
      message: "Delivery partner not found",
    });
  }

  const isActive = deliveryPartner.status === "ACTIVE";

  if (deliveryPartner.status === newStatus) {
    throw new AppError({
      statusCode: 400,
      message: `Delivery partner is already ${isActive ? "active" : "inactive"}`,
    });
  }

  const updatedDeliveryPartner = await db.deliveryBoy.update({
    where: { id: deliveryId },
    data: {
      status: newStatus,
    },
  });

  return updatedDeliveryPartner;
};

type OrderQuery = OrderQuerySchemaType;
export const getOrdersService = async (query: OrderQuery) => {
  const page = query.page || 1;
  const take = query.limit || 6;
  const skip = (page - 1) * take;

  const [orders, count] = await Promise.all([
    db.order.findMany({
      where: {
        orderStatus: {
          not: "PENDING_PAYMENT",
        },
      },
      include: {
        deliveryBoy: true,
        user: true,
      },
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.order.count({
      where: {
        orderStatus: {
          not: "PENDING_PAYMENT",
        },
      },
    }),
  ]);

  return { orders, count };
};

type AssignDelivery = {
  deliveryBoyId: string;
  orderId: string;
};

export const assignDeliveryBoyToOrderService = async ({
  deliveryBoyId,
  orderId,
}: AssignDelivery) => {
  const order = await db.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError({
      statusCode: 404,
      message: "Order not found!",
    });
  }

  if (order.orderStatus !== "CONFIRMED") {
    throw new AppError({
      statusCode: 400,
      message: "Order already assigned to delivery partner!",
    });
  }

  const deliveryPartner = await db.deliveryBoy.findUnique({
    where: { id: deliveryBoyId },
  });

  if (!deliveryPartner) {
    throw new AppError({
      statusCode: 404,
      message: "Delivery partner not found!",
    });
  }

  if (deliveryPartner.status === "INACTIVE") {
    throw new AppError({
      statusCode: 400,
      message: "Delivery partner is already deactivated!",
    });
  }

  const deliveryOtp = crypto.randomInt(100000, 1000000);

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      deliveryBoyId: deliveryBoyId,
      confirmedAt: new Date(),
      assignedAt: new Date(),
      orderStatus: "ASSIGNED",
      deliveryOtp,
    },
  });

  return updatedOrder;
};
