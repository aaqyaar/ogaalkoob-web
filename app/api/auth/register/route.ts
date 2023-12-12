import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, Role, User } from "@prisma/client";
import {
  hashPassword,
  generateToken,
  getErrorResponse,
  getSuccessResponse,
} from "@/lib/helpers";
import { registerSchema } from "@/validations/user";
import * as z from "zod";
import { JwtPayload } from "@/types/auth";

const register = async (
  user: Prisma.UserCreateInput
): Promise<User & { role: Role }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (existingUser) {
    throw { message: "Email already exist", statusCode: 400 };
  }
  const hash = await hashPassword(user.password);
  const subscriberRole = await prisma.role.findFirst({
    where: {
      name: "SUBSCRIBER",
    },
  });

  const newUser = await prisma.user.create({
    data: {
      ...user,
      password: hash,
      role: {
        connect: {
          id: subscriberRole?.id,
        },
      },
    },
    include: { role: true },
  });
  return newUser;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Prisma.UserCreateInput;

  try {
    registerSchema.parse(body);

    const user = await register(body);

    if (!user) {
      return getErrorResponse("Something went wrong", 500);
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      status: user.status,
    };

    const token = generateToken(payload);

    req.cookies.set("token", token);

    return getSuccessResponse({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { status: "fail", message: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const error = err as Error & { statusCode?: number };

    return getErrorResponse(error.message, error.statusCode);
  }
}
