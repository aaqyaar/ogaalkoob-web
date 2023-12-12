import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { Book } from "@prisma/client";
import { purchaseSchema } from "@/validations/purchase";
import * as z from "zod";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as z.infer<typeof purchaseSchema>;
  try {
    const { user } = await isAuthenticated(req, ["ADMIN", "SUBSCRIBER"]);

    if (user.id !== body.userId) {
      return NextResponse.json(
        { message: "You are not authorized to perform this action" },
        {
          status: 403,
        }
      );
    }

    const books = body.books as z.infer<typeof purchaseSchema>["books"];

    // Validate the body
    purchaseSchema.parse(body);

    if (Array.isArray(books)) {
      for (const id of books) {
        const bookExists = await prisma.book.findFirst({
          where: {
            id,
          },
        });

        if (!bookExists) {
          return NextResponse.json(
            { message: "Book not found" },
            {
              status: 404,
            }
          );
        }
      }
    }
    // Check if the user has already purchased the book
    const purchaseExists = await prisma.purchase.findFirst({
      where: {
        userId: body.userId,
        books: {
          some: {
            id: {
              in: books.map((book: Book["id"]) => book),
            },
          },
        },
      },
    });

    if (purchaseExists) {
      return NextResponse.json(
        { message: "You have already purchased this book" },
        {
          status: 409,
        }
      );
    }

    // Check if the body.amount is equal to the total price of the books
    const total = await prisma.book.findMany({
      where: {
        id: {
          in: books.map((book: Book["id"]) => book),
        },
      },
      select: {
        price: true,
      },
    });

    const totalPrice = total.reduce((acc, curr) => acc + curr.price, 0);

    if (totalPrice !== body.amount) {
      return NextResponse.json(
        { message: "Amount is not equal to the total price of the books" },
        {
          status: 400,
        }
      );
    }

    // TODO: Make the payment here
    const purchase = await prisma.purchase.create({
      data: {
        amount: body.amount,
        purchaseDate: new Date(),
        userId: body.userId,
        paymentMethod: body.paymentMethod,
        phoneNumber: body.phoneNumber,
        status: totalPrice === 0 ? "COMPLETED" : "PENDING",
        books: {
          connect: books?.map((pre: Book["id"]) => ({ id: pre })),
        },
      },
      include: {
        books: true,
      },
    });

    return NextResponse.json(
      {
        message: "Purchase successful",
        data: purchase,
      },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.flatten().fieldErrors },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      { message: error.message || error.toString() },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") as string) || 1;
    const limit = parseInt(searchParams.get("limit") as string) || 5;

    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      await prisma.purchase.findMany({
        take: limit,
        skip,
        include: {
          books: true,
          user: {
            include: {
              role: true,
            },
          },
        },
      }),
      await prisma.purchase.count(),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        startIndex: skip + 1,
        endIndex: skip + purchases.length,
        count: purchases.length,
        currentPage: page,
        data: purchases,
        numberOfPages: pages,
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
