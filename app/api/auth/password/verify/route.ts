import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    if (!body.code || !body.email) {
      return NextResponse.json(
        { message: "Code and email are required" },
        {
          status: 400,
        }
      );
    }

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        resetCode: body.code,
        resetCodeExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!passwordReset) {
      return NextResponse.json(
        { message: "Password reset code is invalid or expired" },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Code is valid",
        userId: passwordReset.userId,
        email: body.email,
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
