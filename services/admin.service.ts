import { id } from "zod/locales";
import { User } from "../generated/prisma/client";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import uploadImage from "../utils/uploadImage";
import { UpdateUserProfileType } from "../validations";
import { JsonNull } from "../generated/prisma/internal/prismaNamespace";
import { deleteImage } from "../utils/deleteImage";

export const getUsersService = async () => {
  const users = await db.user.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return users;
};

type DeleteUser = {
  userId: string;
};

export const deleteUserService = async ({ userId }: DeleteUser) => {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }
  await db.user.delete({ where: { id: userId } });
};

export const getUserService = async (id: string) => {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }
  return user;
};

type UpdateUser = {
  data: UpdateUserProfileType;
  id: string;
  buffer?: Buffer;
};

type UserImage = {
  url: string;
  public_id: string;
};

export const updateUserService = async ({ data, buffer, id }: UpdateUser) => {
  const existingUser = await db.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new AppError({ statusCode: 404, message: "User not found!" });
  }

  const oldImage = existingUser?.picture as UserImage | null;
  let image: UserImage | undefined;

  if (buffer) {
    const { url, public_id } = await uploadImage(buffer, "Users");
    image = { url, public_id };
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: {
      firstName: data.firstName || existingUser.firstName,
      lastName: data.lastName || existingUser.lastName,
      primaryPhone: data.primaryPhone || existingUser.primaryPhone,
      secondaryPhone: data.secondaryPhone || existingUser.secondaryPhone,
      city: data.city || existingUser.city,
      country: data.country || existingUser.country,
      postalCode: data.postalCode || existingUser.postalCode,
      street: data.street || existingUser.street,
      picture: image ? image : oldImage ? oldImage : JsonNull,
      role: data.isAdmin ? "ADMIN" : "CUSTOMER",
    },
  });

  if (buffer && oldImage?.public_id) {
    await deleteImage(oldImage.public_id);
  }
  return updatedUser;
};
