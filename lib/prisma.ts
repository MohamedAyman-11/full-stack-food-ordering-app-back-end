import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
const connectionString = `${process.env.DB}`;
const adapter = new PrismaPg({
  connectionString: process.env.DB!,
  max: 10,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
});
const db = new PrismaClient({ adapter });
export default db;
