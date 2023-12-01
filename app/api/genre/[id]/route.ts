import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { genreSchema } from "@/validations/books";
import { isAuthenticated } from "@/lib/auth";
import * as z from "zod";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  const body = await req.json();
  try {
    await isAuthenticated(req, ["ADMIN"]);

    genreSchema.parse(req.body);

    const genre = await prisma.genre.update({
      where: {
        id: params.id as string,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(
      {
        message: "Genre updated successfully",
        data: genre,
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
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
