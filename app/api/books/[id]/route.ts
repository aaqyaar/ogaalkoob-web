import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Genre } from "@prisma/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

interface BookParams extends Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: BookParams) {
  try {
    await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);

    const book = await prisma.book.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        author: true,
        photos: true,
        publishedDate: true,
        isbn: true,
        genre: {
          select: { id: true, name: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { message: "Book not found" },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        ...book,
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

export async function PUT(req: NextRequest, { params }: BookParams) {
  const body = await req.json();
  try {
    await isAuthenticated(req);

    let genre: Genre["id"][] = [];

    if (body.genre) {
      genre = Array.isArray(body.genre) ? body.genre : [body.genre];
    }

    genre = genre?.filter(Boolean);

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...body,
        genre: {
          connect: genre?.map((pre: Genre["id"]) => ({ id: pre })),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Book updated successfully",
        data: book,
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    const formattedError = error.message.includes("Unique constraint failed")
      ? "Book already exists"
      : error.message || error.toString();
    return NextResponse.json(
      { message: formattedError },
      {
        status: 500,
      }
    );
  }
}
