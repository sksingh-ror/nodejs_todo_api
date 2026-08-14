import { SignJWT, jwtVerify } from "jose";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN
} from "../config/auth/jwt.js";

export const generateAccessToken = async (userId) => {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
};

export const verifyAccessToken = async (token) => {
  const { payload } = await jwtVerify(token, JWT_SECRET);

  return payload;
};