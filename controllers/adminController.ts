import { NextFunction, Request, Response } from "express";
import * as adminServices from "../services/admin.service";

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
