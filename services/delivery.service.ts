import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import { compareHash, generateHash } from "../utils/handlers";
import jwt from "jsonwebtoken";
import type {
  DeliveryOrdersQuerySchemaType,
  DeliveryLoginSchemaType,
  DeliveryRegisterSchemaType,
} from "../validations/index";
import { OrderWhereInput } from "../generated/prisma/models";
import { OrderStatus } from "../generated/prisma/enums";

// SIGNUP
type Signup = {
  data: DeliveryRegisterSchemaType;
};

export const signupService = async ({ data }: Signup) => {
  const existingBoy = await db.deliveryBoy.findUnique({
    where: { email: data.email },
  });

  if (existingBoy) {
    throw new AppError({ statusCode: 400, message: "Email already exist!" });
  }

  const hashedPassword = await generateHash(data.password);

  const boy = await db.deliveryBoy.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      vehicle: data.vehicle,
    },
  });

  return boy;
};

// SIGNIN
type Login = {
  data: DeliveryLoginSchemaType;
  rememberMe: boolean;
};

export const loginService = async ({ data, rememberMe }: Login) => {
  const existingDelivery = await db.deliveryBoy.findUnique({
    where: { email: data.email },
  });

  if (!existingDelivery) {
    throw new AppError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  if (existingDelivery && existingDelivery.status === "INACTIVE") {
    throw new AppError({
      message:
        "Your account has been deactivated. Please contact support for assistance.",
      statusCode: 403,
    });
  }

  const isValidPassword = await compareHash(
    data.password,
    existingDelivery.password,
  );

  if (!isValidPassword) {
    throw new AppError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const accessToken = jwt.sign(
    {
      deliveryId: existingDelivery.id,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: rememberMe ? "7d" : "1d" },
  );

  return { deliveryBoy: existingDelivery, accessToken };
};

// GET MY ORDERS

type GetMyOrders = {
  id: string;
  query: DeliveryOrdersQuerySchemaType;
};

export const getMyOrdersService = async ({ id, query }: GetMyOrders) => {
  const where: OrderWhereInput = {
    deliveryBoyId: id,
  };

  if (query.status === "active") {
    where.orderStatus = {
      in: ["ASSIGNED", "PACKED", "OUT_FOR_DELIVERY"],
    };
  } else if (query.status === "completed") {
    where.orderStatus = "DELIVERED";
  }

  const page = query.page || 1;
  const limit = query.limit || 6;
  const skip = (page - 1) * limit;

  const [orders, count] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: true,
      },
    }),
    db.order.count({ where }),
  ]);
  return { orders, count };
};

// UPDATE ORDER STATUS

type UpdateOrderStatus = {
  orderId: string;
  deliveryBoyId: string;
  newStatus: "PACKED" | "OUT_FOR_DELIVERY";
};

export const updateOrderStatusService = async ({
  orderId,
  deliveryBoyId,
  newStatus,
}: UpdateOrderStatus) => {
  const allowedNextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    ASSIGNED: "PACKED",
    PACKED: "OUT_FOR_DELIVERY",
  } as const;

  const existingOrder = await db.order.findUnique({ where: { id: orderId } });

  if (!existingOrder) {
    throw new AppError({ statusCode: 404, message: "Order not found!" });
  }

  if (existingOrder.deliveryBoyId !== deliveryBoyId) {
    throw new AppError({
      statusCode: 403,
      message: "You are not assigned to this order!",
    });
  }

  if (allowedNextStatus[existingOrder.orderStatus] !== newStatus) {
    throw new AppError({
      statusCode: 400,
      message: `Order cannot be changed from ${existingOrder.orderStatus} to ${newStatus}!`,
    });
  }

  const data = {
    orderStatus: newStatus,
    ...(newStatus === "PACKED" && {
      packedAt: new Date(),
    }),
    ...(newStatus === "OUT_FOR_DELIVERY" && {
      outForDeliveryAt: new Date(),
    }),
  };

  const order = await db.order.update({
    where: { id: orderId },
    data,
  });

  return order;
};

type CompleteOrder = {
  orderId: string;
  deliveryBoyId: string;
  deliveryOtp: number;
};

export const completeOrderService = async ({
  orderId,
  deliveryBoyId,
  deliveryOtp,
}: CompleteOrder) => {
  const order = await db.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError({ statusCode: 404, message: "Order not found!" });
  }

  if (order.deliveryBoyId !== deliveryBoyId) {
    throw new AppError({
      statusCode: 403,
      message: "You are not assigned to this order!",
    });
  }

  if (order.orderStatus !== "OUT_FOR_DELIVERY") {
    throw new AppError({
      statusCode: 400,
      message: `Order cannot be changed from ${order.orderStatus.toLowerCase()} to delivered!`,
    });
  }

  if (order.deliveryOtp !== deliveryOtp) {
    throw new AppError({
      statusCode: 400,
      message: "Invalid delivery otp!",
    });
  }

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      deliveredAt: new Date(),
      deliveryOtp: null,
      orderStatus: "DELIVERED",
      ...(order.paymentMethod === "ON_DELIVERY" && {
        payment: {
          update: {
            paidAt: new Date(),
            status: "PAID",
          },
        },
      }),
    },
  });

  return updatedOrder;
};

type CancelOrder = {
  orderId: string;
  deliveryBoyId: string;
};

export const cancelOrderService = async ({
  orderId,
  deliveryBoyId,
}: CancelOrder) => {
  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError({
      statusCode: 404,
      message: "Order not found!",
    });
  }

  if (order.deliveryBoyId !== deliveryBoyId) {
    throw new AppError({
      statusCode: 403,
      message: "You are not assignable to manage this order!",
    });
  }

  const cancellableStatuses = ["ASSIGNED", "CONFIRMED"];

  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new AppError({
      statusCode: 400,
      message: "This order cannot be canceled!",
    });
  }

  const updatedOrder = await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      orderStatus: "CANCELLED",
    },
  });

  return updatedOrder;
};
