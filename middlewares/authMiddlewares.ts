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
  const freshUser = await db.user.findUnique({ where: { id: decoded.userId } });
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
