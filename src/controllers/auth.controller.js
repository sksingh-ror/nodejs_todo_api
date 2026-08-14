import {
  registerUser,
  findUserByEmail,
  verifyUserPassword
} from "../services/auth.service.js";

import { AuthenticationError } from "../errors/authentication.error.js";
import { generateAccessToken } from "../services/jwt.service.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password
  });

  res.status(201).json({
    data: user
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AuthenticationError();
  }

  const passwordValid = await verifyUserPassword(
    password,
    user.password
  );

  if (!passwordValid) {
    throw new AuthenticationError();
  }

  const accessToken = await generateAccessToken(user.id);

  res.json({
    data: {
      accessToken
    }
  });
};

export const getCurrentUser = async (req, res) => {
  res.json({
    data: {
      userId: req.userId
    }
  });
};