import { Request, Response } from "express";
4;
import crypto from "crypto";
import db from "../lib/prisma";
import { AppError } from "../utils/appError";
import {
  compareHash,
  generateAndSendTokens,
  generateHash,
} from "../utils/handlers";
import { OAuth2Client } from "google-auth-library";

// Register
export const signupService = async (req: Request) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    throw new AppError({
      statusCode: 400,
      message: "All fields are required!",
    });
  }
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
export const loginService = async (
  req: Request,
  res: Response,
  remember: boolean,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError({
      statusCode: 400,
      message: "Email and password are required!",
    });
  }
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
  await generateAndSendTokens({ userId: existingUser.id, res, remember });
  return { existingUser };
};
// Google Auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleAuthService = async (
  req: Request,
  res: Response,
  remember: boolean,
) => {
  const { credential } = req.body;
  if (!credential) {
    throw new AppError({
      statusCode: 400,
      message: "Google credential is required",
    });
  }
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
      await generateAndSendTokens({ userId: existingUser.id, res, remember });
      return existingUser;
    } else {
      throw new AppError({
        statusCode: 400,
        message:
          "This email is already registered. Please sign in with your credentials.",
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
  await generateAndSendTokens({ userId: user.id, res, remember });
  return user;
};

// Logout
export const logoutService = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken && req.user?.id) {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await db.refreshToken.delete({
      where: { tokenHash: hashedRefreshToken },
    });
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};
