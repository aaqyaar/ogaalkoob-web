import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@/lib/helpers";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);

    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}
