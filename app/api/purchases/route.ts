import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;

    const skip = (page - 1) * limit;

    const purchases = await prisma.purchase.findMany({
      take: limit,
      skip,
      include: { books: true, user: true },
    });

    return NextResponse.json(
      {
        startIndex: skip + 1,
        endIndex: skip + purchases.length,
        count: purchases.length,
        currentPage: page,
        data: purchases,
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { message: error.message || error.toString() },
      {
        status: 500,
      }
    );
  }
}
