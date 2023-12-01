import prisma from "@/lib/prisma";
import { getErrorResponse } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);

    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(genres);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message);
  }
}
