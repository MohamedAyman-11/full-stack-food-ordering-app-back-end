import { AppError } from "../utils/appError";
import db from "../lib/prisma";
import uploadImage from "../utils/uploadImage";
import { deleteImage } from "../utils/deleteImage";
import { compareHash, generateHash } from "../utils/handlers";
import {
  ChangePasswordSchemaType,
  UpdateProfileSchemaType,
} from "../validations";
import { Prisma, User } from "../generated/prisma/client";

type UserImage = {
  url: string;
  public_id: string;
};

type UpdateProfile = {
  data: UpdateProfileSchemaType;
  buffer?: Buffer;
  existingUser: User;
};

export const updateProfileService = async ({
  data,
  existingUser,
  buffer,
}: UpdateProfile) => {
  const oldUserImage = existingUser?.picture as UserImage | null;

  let image: UserImage | undefined;

  if (buffer) {
    const { url, public_id } = await uploadImage(buffer, "Users");
    image = { url, public_id };
  }

  const updatedUser = await db.user.update({
    where: { id: existingUser?.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      primaryPhone: data.primaryPhone || existingUser.primaryPhone,
      secondaryPhone: data.secondaryPhone || existingUser.secondaryPhone,
      city: data.city || existingUser.city,
      country: data.country || existingUser.country,
      postalCode: data.postalCode || existingUser.postalCode,
      street: data.street || existingUser.street,
      picture: image ? image : oldUserImage ? oldUserImage : Prisma.JsonNull,
    },
  });

  if (buffer && oldUserImage?.public_id) {
    await deleteImage(oldUserImage.public_id);
  }

  return updatedUser;
};

type ChangePassword = {
  data: ChangePasswordSchemaType;
  currentUser: User;
};

export const changePasswordService = async ({
  data,
  currentUser,
}: ChangePassword) => {
  const { currentPassword, newPassword } = data;

  if (currentUser?.googleId) {
    throw new AppError({
      statusCode: 400,
      message: "Password changes are not available for Google accounts!",
    });
  }

  if (!(await compareHash(currentPassword, currentUser?.password!))) {
    throw new AppError({
      statusCode: 401,
      message: "Your current password is wrong!",
    });
  }

  if (currentPassword === newPassword) {
    throw new AppError({
      statusCode: 400,
      message: "New password must be different from current password!",
    });
  }

  const newHashedPassword = await generateHash(newPassword);

  const user = await db.user.update({
    where: { id: currentUser?.id },
    data: {
      password: newHashedPassword,
    },
  });

  return user;
};
