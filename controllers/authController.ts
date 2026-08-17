import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import {
  generateAccessToken,
  generateAndSendTokens,
  generateRefreshToken,
  sendToken,
} from "../utils/handlers";
import db from "../lib/prisma";
import { CustomRequest } from "../interfaces";
import { AppError } from "../utils/appError";
import crypto from "crypto";
/*
- Register          OK
- Login             OK
- Get Me            OK
- Forgot Password
- Reset Password
- Logout            OK
- Google Auth        OK
*/
export const signup = async (req: Request, res: Response) => {
  const user = await authService.signupService(req);
  res.status(201).json({
    status: "success",
    data: { user },
  });
};

export const login = async (req: Request, res: Response) => {
  const { remember } = req.body;
  const { existingUser: user } = await authService.loginService(
    req,
    res,
    remember,
  );
  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined } },
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const user = await authService.googleAuthService(req, res, true);
  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined } },
  });
};

export const logout = async (req: Request, res: Response) => {
  await authService.logoutService(req, res);
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new AppError({ statusCode: 404, message: "User not found" }));
  }
  res.status(200).json({
    status: "success",
    data: { user: { ...req.user, password: undefined } },
  });
};
