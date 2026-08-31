import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const authValidate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { remember } = req.body;
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }
    req.body = { ...result.data!, remember };
    next();
  };
};

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }
    req.body = { ...result.data! };
    next();
  };
};

export const validateQuery = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Invalid query parameters",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }
    req.query = { ...result.data! };
    next();
  };
};
