import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import { isAuthenticated } from "@/lib/auth";
import * as z from "zod";
import { registerSchema } from "@/validations/user";
import { Status } from "@prisma/client";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await isAuthenticated(req);

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: { role: true },
    });

    return getSuccessResponse(user, 200);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}

// Update a user, Delete a user
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const body = (await req.json()) as z.infer<typeof registerSchema> & {
    role: string;
  };
  try {
    await isAuthenticated(req);

    const { name, email, phone, role, status } = body;

    const user = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        email,
        phone,
        status: status as Status,
        roleId: role,
      },
      include: { role: true },
    });

    return getSuccessResponse(user, 200);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    await isAuthenticated(req);

    //! if user has purchases, don't delete
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: params.id,
      },
    });

    if (purchases.length > 0) {
      return getErrorResponse("User has purchases. Cannot delete user.", 400);
    }

    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return getSuccessResponse(null, 204);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}
