import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import uploadImage from "../utils/uploadImage";
import { Product } from "../generated/prisma/client";
import db from "../lib/prisma";
import slugify from "slugify";
type Size = {
  id: string;
  price: number;
};
type Extra = {
  id: string;
  price: number;
};
export const createProductService = async (req: Request) => {
  const { categoryId, discount, description, name, price } = req.body;
  if (!req.body.sizes || !req.body.extras) {
    throw new AppError({
      statusCode: 400,
      message: "Sizes and extras are required",
    });
  }
  const sizes: Size[] = JSON.parse(req.body.sizes);
  const extras: Extra[] = JSON.parse(req.body.extras);
  const [allowedSizes, allowedExtras] = await Promise.all([
    db.categorySize.findMany({
      where: {
        categoryId,
      },
      select: { sizeId: true },
    }),
    db.categoryExtra.findMany({
      where: {
        categoryId,
      },
      select: {
        extraId: true,
      },
    }),
  ]);
  const allowedSizeIds = new Set(allowedSizes.map((item) => item.sizeId));
  const allowedExtraIds = new Set(allowedExtras.map((item) => item.extraId));
  const invalidSize = sizes.find((item) => !allowedSizeIds.has(item.id));
  const invalidExtra = extras.find((item) => !allowedExtraIds.has(item.id));
  if (invalidSize) {
    throw new AppError({
      statusCode: 400,
      message: "One or more sizes are not available for this category",
    });
  }
  if (invalidExtra) {
    throw new AppError({
      statusCode: 400,
      message: "One or more extras are not available for this category",
    });
  }
  const file = req.file;
  if (!file)
    throw new AppError({
      statusCode: 400,
      message: "Product image is required",
    });
  const { url, public_id } = await uploadImage(file.buffer, "Products");
  const slug = slugify(name, { lower: true, trim: true });
  const product = await db.product.create({
    data: {
      name,
      description,
      price: Number(price),
      discount: Number(discount),
      image: { url, public_id },
      slug,
      category: {
        connect: {
          id: categoryId,
        },
      },
      productSizes: {
        create: sizes.map((size) => ({
          price: size.price,
          size: {
            connect: {
              id: size.id,
            },
          },
        })),
      },
      productExtras: {
        create: extras.map((extra) => ({
          price: extra.price,
          extra: {
            connect: {
              id: extra.id,
            },
          },
        })),
      },
    },
    include: {
      category: true,
    },
  });
  return product;
};

export const getProductService = async (id: string) => {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      productSizes: {
        select: {
          price: true,
          size: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      productExtras: {
        select: {
          price: true,
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
  if (!product)
    throw new AppError({ statusCode: 404, message: "Product not found" });
  return product;
};
