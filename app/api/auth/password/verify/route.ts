import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    if (!body.code || !body.email) {
      return getErrorResponse("Code and email are required", 422);
    }

    const passwordReset = await prisma.passwordReset.findUnique({
      where: {
        resetCode: body.code,
        resetCodeExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!passwordReset) {
      return getErrorResponse("Password reset code is invalid or expired", 422);
    }

    return getSuccessResponse({
      message: "Code is valid",
      userId: passwordReset.userId,
      email: body.email,
    });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    return getErrorResponse(error.message, error.statusCode);
  }
}
