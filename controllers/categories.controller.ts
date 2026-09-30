import { Request, Response } from "express";
import * as categoryServices from "../services/category.service";
import { productQuerySchema } from "../validations";

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
  const query = productQuerySchema.parse(req.query);
  const { categories, count } =
    await categoryServices.getCategoriesWithProductsService(query);

  res.status(200).json({
    status: "success",
    results: count,
    data: {
      categories,
    },
  });
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await categoryServices.getCategory({
    id: req.params.id as string,
  });

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryServices.createCategoryService({
    name: req.body.name,
    buffer: req.file?.buffer,
  });

  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await categoryServices.updateCategoryService({
    id: req.params.id as string,
    buffer: req.file ? req.file.buffer : undefined,
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  await categoryServices.deleteCategoryService(req.params.id as string);

  res.status(204).json({
    status: "success",
    data: {},
  });
};
