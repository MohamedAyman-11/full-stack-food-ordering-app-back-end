import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import { ExtraSchemaType } from "../validations";

export const createExtraService = async ({ name }: ExtraSchemaType) => {
  const extra = await db.extra.create({ data: { name } });
  return extra;
};

export const getExtrasService = async () => {
  const extras = await db.extra.findMany({ orderBy: { updatedAt: "desc" } });

  return extras;
};

export const deleteExtraService = async (extra_id: string) => {
  const extra = await db.extra.findUnique({ where: { id: extra_id } });

  if (!extra) {
    throw new AppError({ statusCode: 404, message: "Extra not found" });
  }

  await db.extra.delete({ where: { id: extra_id } });
};

type UpdateExtra = {
  extra_id: string;
  data: ExtraSchemaType;
};

export const updateExtraService = async ({ data, extra_id }: UpdateExtra) => {
  const extra = await db.extra.findUnique({ where: { id: extra_id } });

  if (!extra) {
    throw new AppError({ statusCode: 404, message: "Extra not found" });
  }

  const updatedExtra = await db.extra.update({
    where: { id: extra_id },
    data,
  });
  return updatedExtra;
};
