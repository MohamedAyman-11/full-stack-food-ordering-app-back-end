import { NextFunction, Request, Response } from "express";
import db from "../lib/prisma";
import * as productService from "../services/product.service";
export const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await productService.getProductService(id as string);
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProductService(req);
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
};
