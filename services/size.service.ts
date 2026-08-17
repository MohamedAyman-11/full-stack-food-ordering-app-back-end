import { Size } from "../generated/prisma/client";
import db from "../lib/prisma";

export const createSizeService = async ({ name }: Size) => {
  const size = await db.size.create({
    data: { name },
  });
  return size;
};
export const getSizesService = async () => {
  const sizes = await db.size.findMany();
  return sizes;
};
