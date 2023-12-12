import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);
    const me = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,

        purchases: {
          include: {
            books: true,
          },
          where: {
            status: "COMPLETED",
          },
        },
      },
    });
    return getSuccessResponse(me);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    return getErrorResponse(error.message, error.statusCode);
  }
}
