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
) => {
  const products = await productService.getProductsService();
  res.status(200).json({
    status: "success",
    data: { products },
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProductService({
    data: req.body,
    buffer: req.file?.buffer,
  });
  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await productService.deleteProductService(req.params.id as string);
  res.status(204).json({ status: "success", data: {} });
};
