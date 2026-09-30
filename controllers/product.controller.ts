import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { productQuerySchema } from "../validations";

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

export const getAllProducts = async (req: Request, res: Response) => {
  const query = productQuerySchema.parse(req.query);

  const { products, count } = await productService.getProductsService({
    query,
  });

  res.status(200).json({
    status: "success",
    data: {
      products,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / (query.limit || 6)),
        page: query.page || 1,
        limit: query.limit || 6,
      },
    },
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

export const updateProduct = async (req: Request, res: Response) => {
  const product = await productService.updateProductService({
    data: req.body,
    id: req.params.id as string,
    buffer: req.file?.buffer,
  });

  res.status(200).json({
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

export const getBestSeller = async (req: Request, res: Response) => {
  const products = await productService.getBestSellerService();
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
};
