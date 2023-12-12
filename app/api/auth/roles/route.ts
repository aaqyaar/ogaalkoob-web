import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getErrorResponse, getSuccessResponse } from "@/lib/helpers";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await isAuthenticated(req);
    const roles = await prisma.role.findMany();
    return getSuccessResponse({ data: roles }, 200);
  } catch (err) {
    const error = err as Error;
    return getErrorResponse(error.message || error.toString(), 500);
  }
}
