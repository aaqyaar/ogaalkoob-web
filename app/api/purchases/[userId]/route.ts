import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

interface PurchaseParams extends Params {
  userId: string;
}

export async function GET(req: NextRequest, { params }: PurchaseParams) {
  try {
    await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;

    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      await prisma.purchase.findMany({
        take: limit,
        skip,
        where: {
          userId: params.userId,
          status: "COMPLETED",
        },
        include: { books: true },
      }),
      await prisma.purchase.count({
        where: {
          userId: params.userId,
          status: "COMPLETED",
        },
      }),
    ]);

    return NextResponse.json(
      {
        startIndex: skip + 1,
        endIndex: skip + purchases.length,
        count: purchases.length,
        currentPage: page,
        data: purchases,
        numberOfPages: Math.ceil(total / limit),
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
