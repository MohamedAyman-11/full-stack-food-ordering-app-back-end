import { Request, Response } from "express";
import * as deliveryService from "../services/delivery.service";
import { deliveryOrdersQuerySchema } from "../validations";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  const deliveryBoy = await deliveryService.signupService({ data: req.body });

  res.status(201).json({
    status: "success",
    data: { deliveryBoy },
  });
};

// SIGNIN
export const login = async (req: Request, res: Response) => {
  const remember = req.body.remember;
  const { deliveryBoy, accessToken } = await deliveryService.loginService({
    data: req.body,
    rememberMe: remember,
  });

  res.cookie("deliveryAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ...(remember && { maxAge: 7 * 24 * 60 * 60 * 1000 }),
  });

  res.status(200).json({
    status: "success",
    data: {
      deliveryBoy,
    },
    token: accessToken,
  });
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("deliveryAccessToken");

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};

// GET ME
export const getCurrentDeliveryBoy = async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: { deliveryBoy: { ...req.deliveryBoy, password: undefined } },
  });
};

// GET MY ORDERS
export const getMyOrders = async (req: Request, res: Response) => {
  const query = deliveryOrdersQuerySchema.parse(req.query);

  const { orders, count } = await deliveryService.getMyOrdersService({
    query,
    id: req.deliveryBoy?.id!,
  });

  res.status(200).json({
    status: "success",
    data: {
      orders,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / (query.limit || 6)),
        page: query.page || 1,
        limit: query.limit || 6,
      },
    },
  });
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const deliveryBoyId = req.deliveryBoy!.id;
  const newStatus = req.body.newStatus;
  const order = await deliveryService.updateOrderStatusService({
    orderId,
    deliveryBoyId,
    newStatus,
  });

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};

// COMPLETE ORDER
export const completeOrder = async (req: Request, res: Response) => {
  const data = {
    deliveryBoyId: req.deliveryBoy!.id,
    orderId: req.params.id as string,
    deliveryOtp: req.body.deliveryOtp as number,
  };

  const order = await deliveryService.completeOrderService(data);

  res.status(200).json({
    status: "success",
    data: { order },
  });
};

// CANCEL ORDER
export const cancelOrder = async (req: Request, res: Response) => {
  const order = deliveryService.cancelOrderService({
    deliveryBoyId: req.deliveryBoy!.id,
    orderId: req.params.id as string,
  });

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};
