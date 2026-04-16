"use server";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decoded,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
      err,
    };
  }
};
const decodeToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  return decoded;
};
export const jwtUtiles = {
  verifyToken,
  decodeToken,
};
