import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import db from "../lib/prisma";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization;

  let token = authHeaders?.startsWith("Bearer ")
    ? authHeaders.split(" ")[1]
    : req.cookies.accessToken;

  if (!token)
    return next(
      new AppError({
        statusCode: 401,
        message: "You are not logged in! Please log in to get access.",
      }),
    );

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
    userId: string;
  };

  const freshUser = await db.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!freshUser) {
    return next(
      new AppError({
        statusCode: 401,
        message: "The user belonging to this token does no longer exist!",
      }),
    );
  }

  req.user = freshUser;
  next();
};

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new AppError({
          message: "You are not authorized to access this route",
          statusCode: 403,
        }),
      );
    }
    next();
  };
};

export const protectDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization;

  let token = authHeaders?.startsWith("Bearer ")
    ? authHeaders.split(" ")[2]
    : req.cookies.deliveryAccessToken;

  if (!token)
    return next(
      new AppError({
        statusCode: 401,
        message: "You are not logged in! Please log in to get access.",
      }),
    );

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
    deliveryId: string;
  };

  const freshDelivery = await db.deliveryBoy.findUnique({
    where: { id: decoded.deliveryId },
  });

  if (!freshDelivery) {
    return next(
      new AppError({
        statusCode: 401,
        message:
          "The delivery boy belonging to this token does no longer exist!",
      }),
    );
  }

  req.deliveryBoy = freshDelivery;
  next();
};
