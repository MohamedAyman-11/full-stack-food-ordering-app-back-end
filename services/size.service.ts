import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import { SizeSchemaType } from "../validations";

export const createSizeService = async ({ name }: SizeSchemaType) => {
  const size = await db.size.create({
    data: { name },
  });
  return size;
};

export const getSizesService = async () => {
  const sizes = await db.size.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return sizes;
};

export const deleteSizeService = async (size_id: string) => {
  const size = await db.extra.findUnique({ where: { id: size_id } });

  if (!size) {
    throw new AppError({ statusCode: 404, message: "Size not found" });
  }

  await db.size.delete({ where: { id: size_id } });
};

type UpdateSize = {
  size_id: string;
  data: SizeSchemaType;
};

export const updateSizeService = async ({ data, size_id }: UpdateSize) => {
  const size = await db.extra.findUnique({ where: { id: size_id } });

  if (!size) {
    throw new AppError({ statusCode: 404, message: "Size not found" });
  }

  const updatedSize = await db.size.update({
    where: { id: size_id },
    data,
  });
  return updatedSize;
};
