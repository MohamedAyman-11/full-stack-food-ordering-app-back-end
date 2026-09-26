import Stripe from "stripe";
import { OrderStatus } from "../generated/prisma/enums";
import { OrderWhereInput } from "../generated/prisma/models";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import {
  calculateItemSubtotal,
  getPriceAfterDiscount,
} from "../utils/handlers";
import { OrderQuerySchemaType, OrderSchemaType } from "../validations";
import crypto from "crypto";
import stripe from "../lib/stripe";

type StripeSession = {
  orderId: string;
  userId: string;
};

export const createCheckoutSessionService = async ({
  orderId,
  userId,
}: StripeSession) => {
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      payment: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError({
      statusCode: 404,
      message: "Order not found!",
    });
  }

  if (order.paymentMethod !== "CREDIT") {
    throw new AppError({
      statusCode: 400,
      message: "This order does not require online payment!",
    });
  }

  if (order.payment?.status === "PAID") {
    throw new AppError({
      statusCode: 400,
      message: "Order is already paid!",
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      ...order.orderItems.map((item) => {
        const image = item.product.image as {
          url: string;
          public_id: string;
        };

        return {
          price_data: {
            currency: "usd",

            product_data: {
              name: item.product.name,
              description: item.product.description,
              images: [image.url],
            },

            unit_amount: Math.round(Number(item.totalPrice) * 100),
          },

          quantity: 1,
        };
      }),

      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
            images: [
              "https://res.cloudinary.com/dcmsmypvg/image/upload/v1789643835/about-food.webp",
            ],
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],

    metadata: {
      orderId,
      userId,
    },

    success_url: `${process.env.ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,

    cancel_url: `${process.env.ORIGIN}/checkout/cancel?order_id=${order.id}`,
  });
  return session;
};

type CreateOrder = {
  data: OrderSchemaType;
  userId: string;
};

export const createOrderService = async ({ data, userId }: CreateOrder) => {
  const products = await db.product.findMany({
    where: {
      id: {
        in: data.products.map((product) => product.productId),
      },
    },
    include: {
      productSizes: true,
      productExtras: true,
    },
  });

  const orderItems = data.products.map((item) => {
    const product = products.find((p) => p.id === item.productId);

    if (!product) {
      throw new AppError({
        message: `Product with id ${item.productId} not found`,
        statusCode: 404,
      });
    }

    const size = product.productSizes.find((s) => s.sizeId === item.sizeId);

    if (!size) {
      throw new AppError({ statusCode: 404, message: "Size not found" });
    }

    const extras =
      item.extras?.map((e) => {
        const productExtra = product.productExtras.find(
          (extra) => extra.extraId === e.id,
        );

        if (!productExtra) {
          throw new AppError({
            statusCode: 404,
            message: "Extras not found",
          });
        }

        return {
          extraId: productExtra.extraId,
          price: Number(productExtra.price),
        };
      }) ?? [];

    const basePrice = getPriceAfterDiscount(
      Number(size.price),
      Number(product.discount ?? 0),
    );

    const itemTotalPrice = calculateItemSubtotal({
      basePrice,
      extras: extras,
      quantity: item.quantity,
    });

    return {
      productId: product.id,
      sizeId: size.sizeId,
      unitPrice: basePrice,
      extras: extras,
      quantity: item.quantity,
      discount: item.discount,
      itemTotalPrice,
    };
  });

  const orderSubtotal = Math.ceil(
    orderItems.reduce((prev, curr) => prev + curr.itemTotalPrice, 0),
  );

  const orderCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  const order = await db.order.create({
    data: {
      userId,
      customerPhone: data.customerPhone,
      code: orderCode,
      subtotal: orderSubtotal,
      totalPrice: orderSubtotal + 5,
      city: data.city,
      country: data.country,
      deliveryFee: 5,
      postalCode: data.postalCode,
      street: data.street,
      paymentMethod: data.paymentMethod.toUpperCase() as
        | "CREDIT"
        | "ON_DELIVERY",

      orderStatus:
        data.paymentMethod === "on_delivery" ? "CONFIRMED" : "PLACED",
      placedAt: new Date(),
      ...(data.paymentMethod === "on_delivery" && {
        confirmedAt: new Date(),
      }),

      payment: {
        create: {
          status: "UNPAID",
          amount: orderSubtotal + 5,
        },
      },
      orderItems: {
        create: orderItems.map((product) => ({
          productId: product.productId,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          discount: product.discount ?? 0,
          sizeId: product.sizeId,
          orderItemExtras: {
            create: product.extras?.map((extra) => ({
              extraId: extra.extraId,
              price: extra.price,
            })),
          },

          totalPrice: product.itemTotalPrice,
        })),
      },
    },
  });

  if (data.paymentMethod === "on_delivery") {
    return { order };
  }
  if (data.paymentMethod === "credit") {
    const session = await createCheckoutSessionService({
      orderId: order.id,
      userId: userId,
    });

    return {
      order,
      checkOutUrl: session.url,
    };
  }

  return { order };
};

type GetMyOrders = {
  userId: string;
  query: OrderQuerySchemaType;
};

export const getMyOrdersService = async ({ userId, query }: GetMyOrders) => {
  const where: OrderWhereInput = {
    userId,
  };

  if (query.status && query.status.toLowerCase() !== "all") {
    const status = query.status.toUpperCase() as OrderStatus;
    where.orderStatus = status;
  }

  const page = query.page ?? 1;
  const take = query.limit ?? 4;
  const skip = (page - 1) * take;

  const [orders, count] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      skip,
      take,
    }),
    db.order.count({ where }),
  ]);
  return { orders, count };
};

type GetOrder = {
  id: string;
};

export const getOrderService = async ({ id }: GetOrder) => {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      payment: true,
      orderItems: {
        include: {
          size: true,
          product: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!order) {
    throw new AppError({ statusCode: 404, message: "Order not found" });
  }
  return order;
};

type StripeWebhook = {
  event: Stripe.Event;
};

export const stripeWebhookService = async ({ event }: StripeWebhook) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (session.payment_status !== "paid") {
        return;
      }

      await db.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: {
            id: orderId,
            userId,
          },
          include: {
            payment: true,
          },
        });

        if (!order) {
          throw new AppError({
            statusCode: 404,
            message: "Order not found!",
          });
        }

        if (order.payment?.status === "PAID") {
          throw new AppError({
            statusCode: 400,
            message: "Order already paid!",
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            confirmedAt: new Date(),
            orderStatus: "CONFIRMED",
            payment: {
              update: {
                paidAt: new Date(),
                status: "PAID",
                stripeSessionId: session.id,
                stripePaymentIntentId:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null,
              },
            },
          },
        });
        return;
      });
    }

    case "checkout.session.expired": {
      console.log("Checkout session expired");
      return;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
      return;
  }
};
