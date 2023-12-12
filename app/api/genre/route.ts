import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { genreSchema } from "@/validations/books";
import { isAuthenticated } from "@/lib/auth";
import * as z from "zod";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req, ["ADMIN"]);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;
    const skip = (page - 1) * limit;

    const [genres, total] = await Promise.all([
      await prisma.genre.findMany({
        skip,
        take: limit,

        include: {
          books: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      await prisma.genre.count(),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        startIndex: skip + 1,
        endIndex: skip + genres.length,
        count: genres.length,
        currentPage: page,
        numberOfPages: pages,
        data: genres,
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await isAuthenticated(req, ["ADMIN"]);

    genreSchema.parse(body);

    const genre = await prisma.genre.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(genre, { status: 201 });
  } catch (err) {
    const error = err as Error;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formattedError = error.message.includes("Unique constraint failed")
      ? "Genre already exists"
      : error.message || error.toString();

    return NextResponse.json(
      { message: formattedError },
      {
        status: 500,
      }
    );
  }
}
