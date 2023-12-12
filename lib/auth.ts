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
    throw { statusCode: 401, message: "Not authenticated" };
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw { statusCode: 401, message: "Not authenticated" };
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw { statusCode: 401, message: "Not authenticated" };
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
    throw { statusCode: 401, message: "Not authenticated" };
  }

  if (!authorizedRoles.includes(user.role.name)) {
    throw {
      statusCode: 403,
      message: "Forbidden, you are not authorized to access this route",
    };
  }

  return { payload, user };
};
