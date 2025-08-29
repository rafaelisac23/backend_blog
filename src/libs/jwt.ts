import JWT from "jsonwebtoken";

export const createJWT = (payload: any) => {
  return JWT.sign(payload, process.env.JWT_KEY as string);
};
