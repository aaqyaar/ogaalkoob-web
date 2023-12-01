import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) {
  const body = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }

    const hashedPassword = await hashPassword(body.password);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Something went wrong" },
        {
          status: 500,
        }
      );
    }

    await prisma.passwordReset.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Password reset successfully",
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
