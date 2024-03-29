import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { JwtPayload } from "@/types/auth";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return argon2.verify(hash, password);
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getEnv("JWT_SECRET"), {
    expiresIn: getEnv("JWT_EXPIRATION"),
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getEnv("JWT_SECRET")) as JwtPayload;
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateResetCode = (): string => {
  // 6 digit code with numbers only
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const fCurrency = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export function getErrorResponse(
  error: string | null = null,
  status: number = 500
) {
  const err = error?.includes("prisma")
    ? "Something went wrong, please try again later"
    : error;

  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message: err ? err : null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function getSuccessResponse<T>(data: T, status: number = 200) {
  return new NextResponse(
    JSON.stringify({
      status: "success",
      ...data,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\s/g, "").replace("+", "");
}
