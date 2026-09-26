import { Request, Response } from "express";
import * as adminServices from "../services/admin.service";
import { orderQuerySchema, productQuerySchema } from "../validations";

export const getUsers = async (req: Request, res: Response) => {
  const users = await adminServices.getUsersService();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
};

export const getUser = async (req: Request, res: Response) => {
  const user = await adminServices.getUserService(req.params.id as string);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const user = await adminServices.updateUserService({
    data: req.body,
    buffer: req.file?.buffer,
    id: req.params.id as string,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  await adminServices.deleteUserService({ userId: req.params.id as string });

  res.status(204).json({
    status: "success",
    data: {},
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);

  const { products, count } = await adminServices.getProductsService({ query });
  res.status(200).json({
    status: "success",
    data: {
      products,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / (query.limit || 6)),
        page: query.page || 1,
        limit: query.limit || 6,
      },
    },
  });
};

export const getDeliveryPartners = async (req: Request, res: Response) => {
  const deliveryPartners = await adminServices.getDeliveryPartnersService();

  res.status(200).json({
    status: "success",
    data: { deliveryPartners },
  });
};

export const getActiveDeliveryPartners = async (
  req: Request,
  res: Response,
) => {
  const deliveryPartners =
    await adminServices.getActiveDeliveryPartnersService();

  res.status(200).json({
    status: "success",
    data: { deliveryPartners },
  });
};

export const changeDeliveryPartnerStatus = async (
  req: Request,
  res: Response,
) => {
  const deliveryId = req.params.id as string;
  const newStatus = req.body.newStatus;

  const deliveryPartner =
    await adminServices.changeDeliveryPartnerStatusService({
      deliveryId,
      newStatus,
    });

  res.status(200).json({
    status: "success",
    data: {
      deliveryPartner,
    },
    message: `Delivery partner ${newStatus === "ACTIVE" ? "Activate" : "Deactivate"} successfully`,
  });
};

export const getOrders = async (req: Request, res: Response) => {
  const query = orderQuerySchema.parse(req.query);
  const { orders, count } = await adminServices.getOrdersService(query);

  res.status(200).json({
    status: "success",
    data: {
      orders,
      pagination: {
        total: count,
        page: query.page || 1,
        limit: query.limit || 6,
        totalPages: Math.ceil(count / (query.limit || 6)),
      },
    },
  });
};

export const assignDeliveryBoyToOrder = async (req: Request, res: Response) => {
  const deliveryBoyId = req.body.deliveryBoyId;
  const orderId = req.params.orderId as string;
  const order = await adminServices.assignDeliveryBoyToOrderService({
    deliveryBoyId,
    orderId,
  });

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
};
