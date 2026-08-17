import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Response } from "express";
import jwt from "jsonwebtoken";
import db from "../lib/prisma";
interface SendToken {
  res: Response;
  token: string;
  maxAge?: number;
  tokenName: string;
}
type GenerateAndSendTokens = {
  userId: string;
  res: Response;
  remember?: boolean;
};
export const generateHash = async (value: string) => {
  const hashedValue = await bcrypt.hash(value, 12);
  return hashedValue;
};
export const compareHash = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};
export const generateAccessToken = (userId: string) => {
  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );
  return accessToken;
};

export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(32).toString("hex");
  return refreshToken;
};
export const sendToken = ({ token, res, maxAge, tokenName }: SendToken) => {
  res.cookie(`${tokenName}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...(maxAge !== undefined && { maxAge }),
  });
};

export const generateAndSendTokens = async ({
  userId,
  res,
  remember,
}: GenerateAndSendTokens) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  await db.refreshToken.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tokenHash: hashedRefreshToken,
    },
  });
  sendToken({
    token: accessToken,
    tokenName: "accessToken",
    maxAge: 15 * 60 * 1000,
    res,
  });
  sendToken({
    token: refreshToken,
    tokenName: "refreshToken",
    ...(remember && { maxAge: 30 * 24 * 60 * 60 * 1000 }),
    res,
  });
};
