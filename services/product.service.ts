import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import uploadImage from "../utils/uploadImage";
import { Product } from "../generated/prisma/client";
import db from "../lib/prisma";
import slugify from "slugify";
import { type ProductSchemaType } from "../validations/index";
import { deleteImage } from "../utils/deleteImage";
import { Image } from "../interfaces";
import { JsonNull } from "@prisma/client/runtime/client";

type Size = {
  id: string;
  price: number;
};

type Extra = {
  id: string;
  price: number;
};
interface CreateProduct {
  buffer?: Buffer;
  data: ProductSchemaType;
}

export const createProductService = async ({ buffer, data }: CreateProduct) => {
  const {
    category,
    discount,
    description,
    name,
    price,
    extras,
    sizes,
    isAvailable,
  } = data;

  const [allowedSizes, allowedExtras] = await Promise.all([
    db.categorySize.findMany({
      where: {
        categoryId: category,
      },
      select: { sizeId: true },
    }),
    db.categoryExtra.findMany({
      where: {
        categoryId: category,
      },
      select: {
        extraId: true,
      },
    }),
  ]);

  const allowedSizeIds = new Set(allowedSizes.map((item) => item.sizeId));
  const allowedExtraIds = new Set(allowedExtras.map((item) => item.extraId));

  if (sizes) {
    const invalidSize = sizes.find((item) => !allowedSizeIds.has(item.id));

    if (invalidSize) {
      throw new AppError({
        statusCode: 400,
        message: "One or more sizes are not available for this category",
      });
    }
  }

  if (extras) {
    const invalidExtra = extras.find((item) => !allowedExtraIds.has(item.id));

    if (invalidExtra) {
      throw new AppError({
        statusCode: 400,
        message: "One or more extras are not available for this category",
      });
    }
  }

  if (!buffer) {
    throw new AppError({
      statusCode: 400,
      message: "Product image is required!",
    });
  }

  let image;
  try {
    const { url, public_id } = await uploadImage(buffer, "Products");
    image = { url, public_id };

    const product = await db.$transaction(async (tx) => {
      return tx.product.create({
        data: {
          name,
          description,
          price: String(price),
          discount: String(discount),
          image: {
            url,
            public_id,
          },
          slug: slugify(name, {
            lower: true,
            trim: true,
          }),
          categoryId: category,
          isAvailable,

          productSizes: sizes
            ? {
                create: sizes.map((size) => ({
                  size: {
                    connect: {
                      id: size.id,
                    },
                  },
                  price: String(size.price),
                })),
              }
            : undefined,

          productExtras: extras
            ? {
                create: extras.map((extra) => ({
                  extra: {
                    connect: {
                      id: extra.id,
                    },
                  },
                  price: String(extra.price),
                })),
              }
            : undefined,
        },
      });
    });

    return product;
  } catch (error) {
    if (image?.public_id) {
      await deleteImage(image.public_id);
    }
  }
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

export const getProductsService = async () => {
  const products = await db.product.findMany();
  return products;
};

interface UpdateProduct {
  buffer?: Buffer;
  data: ProductSchemaType;
  id: string;
}

export const updateProductService = async ({
  id,
  buffer,
  data,
}: UpdateProduct) => {
  console.log(data);

  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    throw new AppError({ statusCode: 404, message: "Product not found" });
  }

  if (data.sizes) {
    const allowedExtras = await db.categorySize.findMany({
      where: {
        categoryId: data.category,
      },
    });

    const allowedExtrasIds = new Set(allowedExtras.map((el) => el.sizeId));
    const invalidSizes = data.sizes.find(
      (size) => !allowedExtrasIds.has(size.id),
    );

    if (invalidSizes) {
      throw new AppError({
        statusCode: 400,
        message: "One or more sizes are not available for this category",
      });
    }
  }

  if (data.extras) {
    const allowedExtras = await db.categoryExtra.findMany({
      where: {
        categoryId: data.category,
      },
    });

    const allowedExtrasIds = new Set(allowedExtras.map((el) => el.extraId));
    const invalidExtras = data.extras.find(
      (size) => !allowedExtrasIds.has(size.id),
    );

    if (invalidExtras) {
      throw new AppError({
        statusCode: 400,
        message: "One or more extras are not available for this category",
      });
    }
  }

  type ProductImage = {
    url: string;
    public_id: string;
  };

  let image: ProductImage | undefined;

  try {
    if (buffer) {
      const { url, public_id } = await uploadImage(buffer, "Products");
      image = { url, public_id };
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        categoryId: data.category,
        isAvailable: data.isAvailable,
        image: image ? image : product.image ? product.image : JsonNull,
        slug: slugify(data.name, { lower: true, trim: true }),
        productSizes: data.sizes
          ? {
              deleteMany: {},
              create: data.sizes.map((size) => ({
                size: {
                  connect: {
                    id: size.id,
                  },
                },
                price: size.price,
              })),
            }
          : undefined,
        productExtras: data.extras
          ? {
              deleteMany: {},
              create: data.extras.map((extra) => ({
                extra: {
                  connect: {
                    id: extra.id,
                  },
                },
                price: extra.price,
              })),
            }
          : undefined,
      },
    });

    const oldImage = product.image as Image | null;

    if (oldImage?.public_id && buffer) {
      await deleteImage(oldImage.public_id);
    }
    console.log(updatedProduct);

    return updatedProduct;
  } catch (error) {
    if (image?.public_id) {
      await deleteImage(image.public_id);
    }
  }
};

export const deleteProductService = async (id: string) => {
  const product = await db.product.findUnique({ where: { id } });

  if (!product) {
    throw new AppError({ statusCode: 404, message: "Product not found" });
  }

  await db.product.delete({ where: { id } });
};
