import { User, Role, Prisma } from "@prisma/client";

enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const roles: Omit<Role, "id">[] = [
  {
    name: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "SUBSCRIBER",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const users = [
  {
    email: "abdizamedmo@gmail.com",
    password: "123456",
    name: "Abdi Zamed Mohamed",
    status: Status.ACTIVE,
  },
  {
    email: "active@test.com",
    password: "123456",
    name: "Test User",
    status: Status.ACTIVE,
  },
  {
    email: "inactive@test.com",
    password: "123456",
    name: "Test User",
    status: Status.INACTIVE,
  },
];
