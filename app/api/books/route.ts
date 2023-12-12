import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bookSchema } from "@/validations/books";
import { Genre, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export async function GET(req: NextRequest) {
  try {
    const { user } = await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;
    const q = searchParams.get("q") as string;

    const skip = (page - 1) * limit;
    const qNumber = parseFloat(q);
    const isNumber = !isNaN(qNumber);

    const query = q
      ? {
          OR: [
            {
              title: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              author: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              isbn: {
                contains: q,
                mode: Prisma.QueryMode.insensitive,
              },
            },

            ...(isNumber ? [{ price: { equals: qNumber } }] : []),
            {
              genre: {
                some: {
                  name: {
                    contains: q,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        }
      : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        skip,
        take: limit,
        where: {
          ...query,
          // purchases: {
          //   none: {
          //     userId: user.id,
          //   },
          // },
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          author: true,
          photos: true,
          publishedDate: true,
          isbn: true,
          pdfUrl: user.role.name === "ADMIN" ? true : false,
          audioUrl: user.role.name === "ADMIN" ? true : false,
          genre: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.book.count({
        where: {
          ...query,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        startIndex: skip + 1,
        endIndex: skip + books.length,
        count: books.length,
        currentPage: page,
        numberOfPages: pages,
        data: books,
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
    await isAuthenticated(req);

    bookSchema.parse(body);

    let genre: Genre["id"][] = [];

    if (body.genre) {
      genre = Array.isArray(body.genre) ? body.genre : [body.genre];
    }

    genre = genre?.filter(Boolean);

    const book = await prisma.book.create({
      data: {
        ...body,
        genre: {
          connect: genre?.map((pre: Genre["id"]) => ({ id: pre })),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Book created successfully",
        data: book,
      },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.issues.map((issue) => issue.message).join("\n"),
        },
        {
          status: 400,
        }
      );
    }

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
