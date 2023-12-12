import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { purchaseStatusSchema } from "@/validations/purchase";
import * as z from "zod";

// update purchase status
export async function PUT(req: NextRequest) {
  const body = await req.json();
  try {
    await isAuthenticated(req, ["ADMIN"]);

    purchaseStatusSchema.parse(body);

    const { userId, status, purchaseId } = body as z.infer<
      typeof purchaseStatusSchema
    >;

    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        userId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { message: "Purchase not found" },
        {
          status: 404,
        }
      );
    }

    const updatedPurchase = await prisma.purchase.update({
      where: {
        id: purchase.id,
        userId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Purchase status updated successfully",
        data: updatedPurchase,
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.flatten().fieldErrors },
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
