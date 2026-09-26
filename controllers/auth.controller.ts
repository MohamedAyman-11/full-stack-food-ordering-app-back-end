import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import crypto from "crypto";
import Email from "../utils/email";
import resetPasswordEmail from "../templates/resetPassword";

export const register = async (req: Request, res: Response) => {
  const user = await authService.registerService(req.body);

  res.status(201).json({
    status: "success",
    data: { user },
  });
};

export const login = async (req: Request, res: Response) => {
  const { remember } = req.body;
  const { user, accessToken } = await authService.loginService({
    data: req.body,
    rememberMe: remember,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ...(remember && { maxAge: 7 * 24 * 60 * 60 * 1000 }),
  });

  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined }, token: accessToken },
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const { user, accessToken } = await authService.googleAuthService(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ...(req.body.remember && { maxAge: 7 * 24 * 60 * 60 * 1000 }),
  });

  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined } },
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await authService.forgotPasswordService(req.body);

  let passwordResetToken;

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    passwordResetToken = await db.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetUrl = `${process.env.ORIGIN}/auth/reset-password/${token}`;

    const email = new Email({ user, url: resetUrl });
    const template = resetPasswordEmail({
      name: `${user.firstName} ${user.lastName}`,
      resetUrl,
    });

    await email.sendEmail({ template, subject: "Reset your password" });

    return res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    if (passwordResetToken) {
      await db.passwordResetToken.delete({
        where: {
          id: passwordResetToken.id,
        },
      });
    }

    return next(
      new AppError({
        statusCode: 500,
        message: "There was an error sending the email! Pleas try again later.",
      }),
    );
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const user = await authService.resetPasswordService({
    ...req.body,
    token: req.params.token,
  });

  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined } },
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.status(200).json({
    status: "success",
    message: "Logout successful",
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
