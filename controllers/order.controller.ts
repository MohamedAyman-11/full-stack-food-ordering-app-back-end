import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/order.service";
import * as stripeService from "../services/stripe.service";
import { checkoutSuccessSchema, orderQuerySchema } from "../validations";
import { AppError } from "../utils/appError";
import Stripe from "stripe";
import stripe from "../lib/stripe";

export const createOrder = async (req: Request, res: Response) => {
  const { order, checkOutUrl } = await orderService.createOrderService({
    data: req.body,
    userId: req?.user?.id!,
  });

  res.status(201).json({
    status: "success",
    data: { order, checkOutUrl },
  });
};

export const getMyOrders = async (req: Request, res: Response) => {
  const query = orderQuerySchema.parse(req.query);

  const { orders, count } = await orderService.getMyOrdersService({
    userId: req.user?.id!,
    query: query,
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / (query.limit || 4)),
        page: query.page || 1,
        limit: query.limit || 4,
      },
    },
  });
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await orderService.getOrderService({
    id: req.params.id as string,
  });

  res.status(200).json({
    status: "success",
    data: { order },
  });
};

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return next(
      new AppError({
        statusCode: 400,
        message: "Stripe signature is required!",
      }),
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return next(
      new AppError({
        statusCode: 400,
        message: "Invalid webhook signature!",
      }),
    );
  }

  try {
    await orderService.stripeWebhookService({ event });

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};

export const getCheckoutSuccess = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const query = checkoutSuccessSchema.parse(req.query);

  const { order, paymentStatus } =
    await stripeService.getCheckoutSuccessService({
      userId,
      sessionId: query.session_id,
    });

  res.status(200).json({
    status: "success",
    message: "Checkout session retrieved successfully",
    data: {
      order,
      paymentStatus,
    },
  });
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const orderId = req.params.id as string;

  const session = await orderService.createCheckoutSessionService({
    orderId,
    userId,
  });

  res.status(200).json({
    status: "success",
    checkoutUrl: session.url,
  });
};
