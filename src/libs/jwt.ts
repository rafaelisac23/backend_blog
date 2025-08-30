import JWT from "jsonwebtoken";

export const createJWT = (payload: any) => {
  return JWT.sign(payload, process.env.JWT_KEY as string);
};

export const readJWT = (hash: string) => {
  try {
    return JWT.verify(hash, process.env.JWT_KEY as string);
  } catch (err) {
    return false;
  }
};
