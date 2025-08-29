import { User } from "../generated/prisma";
import { createJWT } from "../libs/jwt";

export const createToken = (user: User) => {
  return createJWT({ id: user.id });
};
