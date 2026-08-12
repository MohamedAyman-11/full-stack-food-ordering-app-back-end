import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"
const connectionString = `${process.env.DB}`
console.log(connectionString);
const adapter = new PrismaPg({connectionString})
const db = new PrismaClient({adapter})
export default db