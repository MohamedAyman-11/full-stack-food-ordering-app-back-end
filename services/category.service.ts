import db from "../lib/prisma";
import uploadImage from "../utils/uploadImage";
import { CategoryUpdateInput } from "../generated/prisma/models";
import { deleteImage } from "../utils/deleteImage";
import { AppError } from "../utils/appError";
import { ProductQuerySchemaType } from "../validations";

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

export const getCategoriesWithProductsService = async (
  query: ProductQuerySchemaType,
) => {
  const categories = await db.category.findMany({
    include: {
      products: {
        where: {
          isAvailable: true,
        },
      },
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
  });
  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }
  return category;
};

type CreateCategory = {
  name: string;
  buffer?: Buffer;
};

export const createCategoryService = async ({
  name,
  buffer,
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
    },
  });

  return category;
};

type UpdateCategory = {
  id: string;
  data: CategoryUpdateInput;
  buffer?: Buffer;
};

export const updateCategoryService = async ({
  id,
  data,
  buffer,
}: UpdateCategory) => {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError({ statusCode: 404, message: "Category not found" });
  }

  const updateData: CategoryUpdateInput = {
    name: data.name,
    image: category?.image!,
  };

  if (buffer) {
    const { url, public_id } = await uploadImage(buffer, "Categories");
    updateData.image = { url, public_id };
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
