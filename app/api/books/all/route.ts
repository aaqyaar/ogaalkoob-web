import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);

    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: "desc", // Sort by latest
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        genre: {
          select: {
            name: true,
          },
        },
        photos: true,
        isbn: true,
        publishedDate: true,
        author: true,
      },
    });
    return getSuccessResponse(books);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}
