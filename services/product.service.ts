import { AppError } from "../utils/appError";
import uploadImage from "../utils/uploadImage";
import db from "../lib/prisma";
import slugify from "slugify";
import {
  ProductQuerySchemaType,
  type ProductSchemaType,
} from "../validations/index";
import { deleteImage } from "../utils/deleteImage";
import { Image } from "../interfaces";
import { JsonNull } from "@prisma/client/runtime/client";
import {
  ProductOrderByWithRelationInput,
  ProductWhereInput,
} from "../generated/prisma/models";

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
        orderBy: {
          price: "asc",
        },
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
        orderBy: {
          price: "asc",
        },
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

type GetProducts = {
  query: ProductQuerySchemaType;
};

export const getProductsService = async ({ query }: GetProducts) => {
  const where: ProductWhereInput = {
    isAvailable: true,
  };

  // FILTER
  if (query.categories && query.categories.toLowerCase() !== "all") {
    const categories = query.categories.split(", ").map((c) => c.trim());
    where.category = {
      name: {
        in: categories,
        mode: "insensitive",
      },
    };
  }

  if (query.search) {
    where.name = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {
      gte: query.minPrice,
      lte: query.maxPrice,
    };
  }

  // SORT

  const sortMap: Record<string, ProductOrderByWithRelationInput> = {
    recent_desc: {
      createdAt: "desc",
    },
    price_asc: {
      price: "asc",
    },
    price_desc: {
      price: "desc",
    },
    discount_desc: {
      discount: "desc",
    },
  };

  const sort = query.sort
    ? sortMap[query.sort as keyof typeof sortMap]
    : sortMap["recent_desc"];

  // PAGINATION
  const page = query.page || 1;
  const limit = query.limit || 6;
  const skip = (page - 1) * limit;

  const [products, count] = await Promise.all([
    db.product.findMany({
      where: where,
      orderBy: sort,
      skip,
      take: limit,
      include: {
        productExtras: {
          include: { extra: true },
          orderBy: {
            price: "asc",
          },
        },
        productSizes: {
          include: {
            size: true,
          },
          orderBy: {
            price: "asc",
          },
        },
      },
    }),
    db.product.count({
      where: where,
    }),
  ]);

  return { products, count };
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

type BestSellerProducts = {
  productId: string;
  soldQuantity: bigint;
};

export const getBestSellerService = async () => {
  const bestSellersProducts = await db.$queryRaw<BestSellerProducts[]>`
    select oi."productId",sum(oi.quantity) as "soldQuantity" from "Order" o inner join "OrderItem" oi on o.id = oi."orderId"
    where o."orderStatus"='DELIVERED' and o."deliveredAt" >= now()- interval '30 days'
    group by oi."productId"
  order by "soldQuantity" desc
  limit 5
  `;

  console.log(bestSellersProducts);

  const productIds = bestSellersProducts.map((product) => product.productId);
  console.log(productIds);

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      productExtras: {
        include: {
          extra: true,
        },
      },
      productSizes: {
        include: {
          size: true,
        },
      },
    },
  });
  return products;
};
