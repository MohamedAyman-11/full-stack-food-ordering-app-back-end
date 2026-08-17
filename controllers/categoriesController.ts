import { NextFunction, Request, Response } from "express";
import * as categoryServices from "../services/category.service";
import db from "../lib/prisma";

export const getCategories = async (req: Request, res: Response) => {
  const { categories, count } = await categoryServices.getCategoriesService();
  res.status(200).json({
    status: "success",
    results: count,
    data: {
      categories,
    },
  });
};
export const getCategoriesWithProducts = async (
  req: Request,
  res: Response,
) => {
  const { categories, count } =
    await categoryServices.getCategoriesWithProductsService();
  res.status(200).json({
    status: "success",
    results: count,
    data: {
      categories,
    },
  });
};
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sizeIds = JSON.parse(req.body.sizeIds);
  const extraIds = JSON.parse(req.body.extraIds);
  const category = await categoryServices.createCategoryService(
    req.body,
    req,
    next,
    sizeIds,
    extraIds,
  );

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
};
export const updateCategory = async (req: Request, res: Response) => {
  const sizeIds = req.body.sizeIds ? JSON.parse(req.body.sizeIds) : undefined;
  const extraIds = req.body.sizeIds ? JSON.parse(req.body.extraIds) : undefined;
  const category = await categoryServices.updateCategoryService(
    req.params.id as string,
    req.body,
    req,
    sizeIds,
    extraIds,
  );
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};
export const deleteCategory = async (req: Request, res: Response) => {
  await db.category.deleteMany();
  await db.product.deleteMany();
  await categoryServices.deleteCategoryService(req.params.id as string);
  res.status(204).json({
    status: "success",
    data: {},
  });
};
