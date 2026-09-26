import db from "../lib/prisma";
import stripe from "../lib/stripe";
import { AppError } from "../utils/appError";

type GetCheckoutSession = {
  sessionId: string;
  userId: string;
};
export const getCheckoutSuccessService = async ({
  userId,
  sessionId,
}: GetCheckoutSession) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError({
      statusCode: 404,
      message: "Checkout session not found",
    });
  }

  const orderId = session.metadata?.orderId;

  if (!orderId) {
    throw new AppError({
      statusCode: 400,
      message: "Order information is missing from checkout session",
    });
  }

  if (session.metadata?.userId !== userId) {
    throw new AppError({
      statusCode: 403,
      message: "You are not allowed to access this order",
    });
  }

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      orderStatus: true,
      totalPrice: true,
      code: true,
      confirmedAt: true,
      paymentMethod: true,
      country: true,
      city: true,
      customerPhone: true,
      street: true,
      postalCode: true,

      payment: {
        select: { status: true },
      },
    },
  });

  if (!order) {
    throw new AppError({
      statusCode: 404,
      message: "Order not found",
    });
  }

  return {
    order,
    paymentStatus: session.payment_status,
  };
};
