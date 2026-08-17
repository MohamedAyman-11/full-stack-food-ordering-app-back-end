import db from "../lib/prisma";
import { Category } from "../generated/prisma/client";
import { NextFunction, Request } from "express";
import uploadImage from "../utils/uploadImage";
import { CategoryUpdateInput } from "../generated/prisma/models";
import { deleteImage } from "../utils/deleteImage";
import { AppError } from "../utils/appError";
type CategoryImage = {
  url: string;
  public_id: string;
};
export const getCategoriesService = async () => {
  const categories = await db.category.findMany();
  return {
    categories,
    count: categories.length,
  };
};
export const getCategoriesWithProductsService = async () => {
  const categories = await db.category.findMany({
    include: {
      products: true,
    },
  });
  return {
    categories,
    count: categories.length,
  };
};
export const createCategoryService = async (
  { name }: Category,
  req: Request,
  next: NextFunction,
  sizeIds: string[],
  extraIds: string[],
) => {
  if (!req.file) {
    return next(
      new AppError({
        statusCode: 400,
        message: "Category image is required",
      }),
    );
  }
  let image = {};
  const { url, public_id } = await uploadImage(req.file.buffer, "Categories");
  image = { url, public_id };
  const category = await db.category.create({
    data: {
      name,
      image,
      categorySizes: {
        create: sizeIds.map((id) => ({
          size: {
            connect: {
              id,
            },
          },
        })),
      },
      categoryExtras: {
        create: extraIds.map((id) => ({
          extra: {
            connect: {
              id,
            },
          },
        })),
      },
    },
    include: {
      categorySizes: {
        include: {
          size: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      categoryExtras: {
        include: {
          extra: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return category;
};
export const updateCategoryService = async (
  id: string,
  data: CategoryUpdateInput,
  req: Request,
  sizeIds?: string[],
  extraIds?: string[],
) => {
  const category = await db.category.findUnique({ where: { id } });
  if (req.file) {
    const { url, public_id } = await uploadImage(req.file.buffer, "Categories");
    data.image = { url, public_id };
  }
  if (sizeIds !== undefined) {
    data.categorySizes = {
      deleteMany: {},
      create: sizeIds.map((id) => ({
        size: {
          connect: {
            id,
          },
        },
      })),
    };
  }
  if (extraIds !== undefined) {
    data.categoryExtras = {
      deleteMany: {},
      create: extraIds.map((id) => ({
        extra: {
          connect: {
            id,
          },
        },
      })),
    };
  }
  const updatedCategory = await db.category.update({ where: { id }, data });

  const oldImage = category?.image as CategoryImage | null;

  if (oldImage?.public_id) await deleteImage(oldImage?.public_id);

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await db.category.findUnique({ where: { id } });
  const oldImage = category?.image as CategoryImage | null;
  await db.category.delete({ where: { id } });
  if (oldImage?.public_id) {
    await deleteImage(oldImage?.public_id);
  }
};
