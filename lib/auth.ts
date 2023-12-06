import { verifyToken } from "./helpers";
import { NextRequest } from "next/server";
import prisma from "./prisma";
import { RoleName } from "@prisma/client";

export const isAuthenticated = async (
  req: NextRequest,
  authorizedRoles: RoleName[] = ["ADMIN"]
) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Not authenticated");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Not authenticated");
  }

  const payload = verifyToken(token);

  // check if the user role is admin
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (!authorizedRoles.includes(user.role.name)) {
    throw new Error("Forbidden, you are not authorized to access this route");
  }

  return { payload, user };
};
