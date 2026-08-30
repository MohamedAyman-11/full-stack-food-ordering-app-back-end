import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import crypto from "crypto";
import Email from "../utils/email";
import resetPasswordEmail from "../templates/resetPassword";
import {
  generateAccessToken,
  generateTokens,
  sendToken,
} from "../utils/handlers";

/*
- Register          OK
- Login             OK
- Get Me            OK
- Forgot Password   OK
- Reset Password    OK
- Logout            OK
- Google Auth       OK
*/

export const signup = async (req: Request, res: Response) => {
  const user = await authService.signupService(req.body);

  const token = generateAccessToken(user.id);

  res.status(201).json({
    status: "success",
    data: { user, token },
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await authService.loginService(req.body);

  const { accessToken, refreshToken } = await generateTokens({
    userId: user.id,
  });

  sendToken({
    token: refreshToken,
    tokenName: "refreshToken",
    ...(req.body.remember && { maxAge: 30 * 24 * 60 * 60 * 1000 }),
    res,
  });

  sendToken({
    token: accessToken,
    tokenName: "accessToken",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    res,
  });

  res.status(200).json({
    status: "success",
    data: { user: { ...user, password: undefined }, token: refreshToken },
  });
};

export const googleAuth = async (req: Request, res: Response) => {
  const user = await authService.googleAuthService(req.body);

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
  const refreshToken = req.cookies.refreshToken;
  await authService.logoutService(refreshToken);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
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
