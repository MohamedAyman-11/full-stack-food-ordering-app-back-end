import db from "../lib/prisma";
import { Category } from "../generated/prisma/client";
import { NextFunction, Request } from "express";
import uploadImage from "../utils/uploadImage";
import { CategoryUpdateInput } from "../generated/prisma/models";
import { deleteImage } from "../utils/deleteImage";
import { AppError } from "../utils/appError";
import { JsonValue } from "@prisma/client/runtime/client";

type CategoryImage = {
  url: string;
  public_id: string;
};

type GetCategory = {
  id: string;
};

export const getCategoriesService = async () => {
  const categories = await db.category.findMany({
    orderBy: { updatedAt: "desc" },
  });

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
    orderBy: { updatedAt: "desc" },
  });

  return {
    categories,
    count: categories.length,
  };
};

export const getCategory = async ({ id }: GetCategory) => {
  const category = await db.category.findUnique({
    where: { id },
    include: {
      categoryExtras: {
        include: {
          extra: true,
        },
      },
      categorySizes: {
        include: {
          size: true,
        },
      },
    },
  });
  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }
  return category;
};

type CreateCategory = {
  name: string;
  buffer?: Buffer;
  sizeIds: string[];
  extraIds: string[];
};

export const createCategoryService = async ({
  name,
  buffer,
  sizeIds,
  extraIds,
}: CreateCategory) => {
  if (!buffer) {
    throw new AppError({
      statusCode: 400,
      message: "Category image is required",
    });
  }

  let image = {};
  const { url, public_id } = await uploadImage(buffer, "Categories");
  image = { url, public_id };

  const category = await db.category.create({
    data: {
      name,
      image,
      categorySizes: {
        ...(sizeIds && {
          create: sizeIds.map((id) => ({
            size: {
              connect: {
                id,
              },
            },
          })),
        }),
      },

      categoryExtras: {
        ...(extraIds && {
          create: extraIds.map((id) => ({
            extra: {
              connect: {
                id,
              },
            },
          })),
        }),
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

type UpdateCategory = {
  id: string;
  data: CategoryUpdateInput;
  buffer?: Buffer;
  sizeIds?: string[];
  extraIds?: string[];
};

export const updateCategoryService = async ({
  id,
  data,
  sizeIds,
  extraIds,
  buffer,
}: UpdateCategory) => {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }

  const updateData: CategoryUpdateInput = {
    categoryExtras: {},
    categorySizes: {},
    name: data.name,
    image: category?.image!,
  };

  if (buffer) {
    const { url, public_id } = await uploadImage(buffer, "Categories");
    updateData.image = { url, public_id };
  }

  if (sizeIds !== undefined) {
    updateData.categorySizes = {
      deleteMany: {},
      create: sizeIds.map((id) => ({
        size: {
          connect: {
            id,
          },
        },
      })),
    };
  } else {
    updateData.categorySizes = {
      deleteMany: {},
    };
  }

  if (extraIds !== undefined) {
    updateData.categoryExtras = {
      deleteMany: {},
      create: extraIds.map((id) => ({
        extra: {
          connect: {
            id,
          },
        },
      })),
    };
  } else {
    updateData.categoryExtras = {
      deleteMany: {},
    };
  }

  const updatedCategory = await db.category.update({
    where: { id },
    data: updateData,
  });

  const oldImage = category?.image as CategoryImage | null;

  if (buffer && oldImage?.public_id) await deleteImage(oldImage?.public_id);

  return updatedCategory;
};

export const deleteCategoryService = async (id: string) => {
  const category = await db.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }

  const oldImage = category?.image as CategoryImage | null;

  await db.category.delete({ where: { id } });

  if (oldImage?.public_id) {
    await deleteImage(oldImage?.public_id);
  }
};

export const getCategoryOptionsService = async (id: string) => {
  const category = await db.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }

  const sizes = await db.categorySize.findMany({
    where: {
      categoryId: id,
    },
    select: {
      size: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  const extras = await db.categoryExtra.findMany({
    where: { categoryId: id },
    select: {
      extra: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  return { sizes, extras };
};
