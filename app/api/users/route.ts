import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import { isAuthenticated } from "@/lib/auth";
import { PaginationResult } from "@/services/api.types";
import { User } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      await prisma.user.findMany({
        orderBy: {
          name: "asc",
        },
        include: { role: true },
      }),
      await prisma.user.count(),
    ]);

    const pages = Math.ceil(total / limit);

    const data: PaginationResult<User> = {
      startIndex: skip + 1,
      endIndex: skip + users.length,
      count: users.length,
      currentPage: page,
      data: users,
      numberOfPages: pages,
    };

    return getSuccessResponse(data, 200);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}
