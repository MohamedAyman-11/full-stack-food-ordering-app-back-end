import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const updateProfile = async (req: Request, res: Response) => {
  const user = await userService.updateProfileService({
    data: req.body,
    existingUser: req.user!,
    buffer: req.file?.buffer,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const updatePassword = async (req: Request, res: Response) => {
  const user = await userService.changePasswordService({
    currentUser: req.user!,
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
