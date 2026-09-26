import crypto from "crypto";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import { compareHash, generateHash } from "../utils/handlers";
import { OAuth2Client } from "google-auth-library";
import {
  ForgotSchemaType,
  GoogleAuthSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
  ResetSchemaType,
} from "../validations";
import jwt from "jsonwebtoken";

// Register
export const registerService = async (data: RegisterSchemaType) => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    const message =
      existingUser.provider === "GOOGLE"
        ? "This email is already registered with Google. Please sign in with Google!"
        : "Email already exists!";

    throw new AppError({
      statusCode: 400,
      message,
    });
  }

  const hashedPassword = await generateHash(password);

  const user = await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  return user;
};

// Login
type Login = {
  data: LoginSchemaType;
  rememberMe: boolean;
};

export const loginService = async ({ data, rememberMe }: Login) => {
  const { email, password } = data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (!existingUser) {
    throw new AppError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  if (existingUser.provider === "GOOGLE" && !existingUser.password) {
    throw new AppError({
      statusCode: 400,
      message: "This account uses Google Sign-In. Please continue with Google.",
    });
  }

  const isValidPassword = await compareHash(password, existingUser?.password!);

  if (!isValidPassword) {
    throw new AppError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const accessToken = jwt.sign(
    { userId: existingUser.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: rememberMe ? "7d" : "1d",
    },
  );

  return { user: existingUser, accessToken };
};

// Google Auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuthService = async (data: GoogleAuthSchemaType) => {
  const { credential } = data;

  // Check if token valid
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AppError({
      statusCode: 400,
      message: "Invalid Google credential",
    });
  }

  const { email, name, picture, email_verified, sub } = payload;

  if (!email_verified) {
    throw new AppError({
      statusCode: 400,
      message: "Email not verified by Google",
    });
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    if (existingUser.provider === "GOOGLE" && existingUser.googleId) {
      const accessToken = jwt.sign(
        { userId: existingUser.id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "7d",
        },
      );

      return { user: existingUser, accessToken };
    } else {
      throw new AppError({
        statusCode: 400,
        message:
          "This email is already registered. Please sign in with your email and password.",
      });
    }
  }

  const user = await db.user.create({
    data: {
      firstName: name?.split(" ")[0] || "",
      lastName: name?.split(" ")[1] || "",
      email: email!,
      provider: "GOOGLE",
      googleId: sub,
      picture: { url: picture },
    },
  });

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return { user, accessToken };
};

// Forgot password
export const forgotPasswordService = async (data: ForgotSchemaType) => {
  const { email } = data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (!existingUser) {
    throw new AppError({
      statusCode: 404,
      message: "There is no user with that email address!",
    });
  }

  if (existingUser.provider === "GOOGLE" && !existingUser.password) {
    throw new AppError({
      statusCode: 400,
      message: "Password reset is not available for Google accounts.",
    });
  }

  return existingUser;
};

// Reset Password
type ResetSchema = ResetSchemaType & { token: string };
export const resetPasswordService = async (data: ResetSchema) => {
  const { token, newPassword } = data;

  if (!token) {
    throw new AppError({ statusCode: 401, message: "Token is required!" });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");

  const validToken = await db.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gt: new Date() },
    },
  });

  if (!validToken) {
    throw new AppError({
      statusCode: 401,
      message: "Password reset token is expired or invalid!",
    });
  }

  const hashedNewPassword = await generateHash(newPassword);

  const updatePassword = db.user.update({
    where: { id: validToken.userId },
    data: {
      password: hashedNewPassword,
    },
  });

  const deleteToken = db.passwordResetToken.delete({
    where: { token: hashedToken },
  });

  await db.$transaction([updatePassword, deleteToken]);

  return await updatePassword;
};
