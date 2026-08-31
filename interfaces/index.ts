import { Request } from "express";
import { User } from "../generated/prisma/client";

export interface CustomRequest extends Request {
  user: User;
}

export interface Image {
  url: string;
  public_id: string;
}
