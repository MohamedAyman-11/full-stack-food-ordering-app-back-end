import { Extra } from "../generated/prisma/client";
import db from "../lib/prisma";

export const createExtraService = async ({ name }: Extra) => {
  const extra = await db.extra.create({ data: { name } });
  return extra;
};
export const getExtrasService = async () => {
  const extras = await db.extra.findMany();
  return extras;
};
