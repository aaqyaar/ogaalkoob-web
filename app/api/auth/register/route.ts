import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, Role, User } from "@prisma/client";
import { hashPassword, generateToken } from "@/lib/helpers";
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
    throw new Error("Email already exists");
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
  const body = await req.json();

  try {
    registerSchema.parse(body);

    const user = await register(body);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Unable to register user" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      status: user.status,
    };

    const token = generateToken(payload);
    req.cookies.set("token", token);

    return new NextResponse(JSON.stringify({ token }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({
          errors: err.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const error = err as Error;

    return new NextResponse(
      JSON.stringify({ message: error.message || error.toString() }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
