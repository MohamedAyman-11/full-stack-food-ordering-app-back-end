import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateTokens, sendToken } from "../utils/handlers";
export const updateProfile = async (req: Request, res: Response) => {
  const user = await userService.updateProfileService({
    data: req.body,
    existingUser: req.user!,
    buffer: req.file?.buffer,
  });

  const { accessToken, refreshToken } = await generateTokens({
    userId: user.id,
  });

  sendToken({
    token: accessToken,
    res,
    tokenName: "accessToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  sendToken({
    token: refreshToken,
    res,
    tokenName: "refreshToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
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
  const { accessToken, refreshToken } = await generateTokens({
    userId: user.id,
  });
  sendToken({
    token: accessToken,
    res,
    tokenName: "accessToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  sendToken({
    token: refreshToken,
    res,
    tokenName: "refreshToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
