import { Request } from "express";
import { User } from "../generated/prisma/client";

export interface CustomRequest extends Request {
  user: User;
}
