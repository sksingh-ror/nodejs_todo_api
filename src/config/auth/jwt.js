import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

export const JWT_SECRET = new TextEncoder().encode(jwtSecret);

export const JWT_EXPIRES_IN = "15m";