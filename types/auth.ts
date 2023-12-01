import { Role, User } from "@prisma/client";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role["name"];
  status: string;
}

export interface ILoginResponse {
  token: string;
}

export interface IUser extends User {}
