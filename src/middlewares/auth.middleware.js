import { verifyAccessToken } from "../services/jwt.service.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";

export const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedError();
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Invalid authorization header");
  }

  try {
    const payload = await verifyAccessToken(token);

    req.userId = payload.sub;

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};