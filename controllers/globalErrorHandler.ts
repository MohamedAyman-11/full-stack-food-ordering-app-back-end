import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { AppError } from "../utils/appError";
type ErrorType = {
  statusCode: number;
  code: string | undefined;
  status: string;
  isOperational: boolean;
  stack?: string;
  message: string;
};
const handleProductionError = (err: ErrorType, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.code && { code: err.code }),
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong !",
    });
  }
};
const handleDevErrors = (err: ErrorType, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    stack: err.stack,
  });
};
const handleJsonWebTokenError = () => {
  return new AppError({
    statusCode: 401,
    message: "Invalid token. Please log in again!",
  });
};

const handleJsonWebTokenExpired = () => {
  return new AppError({
    statusCode: 401,
    message: "Your token has expired! Please log in again!",
  });
};

const handleDuplicationError = (error: PrismaClientKnownRequestError) => {
  console.dir(error.meta, { depth: null });
  const message =
    "A record with this value already exists. Please use a different value.";

  return new AppError({
    statusCode: 400,
    message: message,
    code: undefined,
  });
};
export const globalErrorHandler = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    handleDevErrors(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        error = handleDuplicationError(error);
      }
    }
    // Token Verification Error
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    // Token Expired Error
    if (error.name === "TokenExpiredError") error = handleJsonWebTokenExpired();
    handleProductionError(error, res);
  }
};
