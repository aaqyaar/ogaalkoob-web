import prisma from "@/lib/prisma";
import {
  verifyPassword,
  generateToken,
  getErrorResponse,
  getSuccessResponse,
} from "@/lib/helpers";
import { JwtPayload } from "@/types/auth";
import { NextResponse, NextRequest } from "next/server";
import { loginSchema } from "@/validations/user";
import * as z from "zod";

const isEmail = (val: string) => {
  return z.string().email().safeParse(val).success;
};

const validateUser = async (
  path: "admin",
  username: string,
  password: string
): Promise<string> => {
  //
  const query = isEmail(username) ? { email: username } : { phone: username };

  const user = await prisma.user.findUnique({
    where: {
      ...query,
      role: {
        name: path == "admin" ? "ADMIN" : undefined,
      },
    },
    include: { role: true },
  });
  if (!user) {
    throw { message: "Account not exist", statusCode: 404 };
  }
  const validPassword = await verifyPassword(password, user.password);

  if (!validPassword) {
    throw { message: "Invalid password", statusCode: 400 };
  }
  if (user.status !== "ACTIVE") {
    throw {
      message: "Your account is not active, please contact support",
      statusCode: 400,
    };
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
  const { username, password, path } = (await req.json()) as z.infer<
    typeof loginSchema
  > & {
    path: "admin";
  };

  try {
    loginSchema.parse({ username, password });

    const token = await validateUser(path, username, password);

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
