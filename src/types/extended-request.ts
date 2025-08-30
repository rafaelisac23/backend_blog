import { Request } from "express";
import { User } from "../generated/prisma";

type UserWithOutPassword = Omit<User, "password">;

export type ExtendedRequest = Request & {
  user?: UserWithOutPassword;
};
