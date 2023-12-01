import prisma from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/lib/helpers";
import { JwtPayload } from "@/types/auth";
import { NextResponse, NextRequest } from "next/server";
import { loginSchema } from "@/validations/user";
import * as z from "zod";

const login = async (email: string, password: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid email or password");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active, please contact support");
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role.name,
    status: user.status,
  };
  return generateToken(payload);
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    loginSchema.parse({ email, password });

    const token = await login(email, password);

    return new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ errors: err.flatten().fieldErrors }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const error = err as Error;
    return new NextResponse(
      JSON.stringify({ message: error.message || error.toString() }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
