import { prisma } from "../config/database.js";
import argon2 from "argon2";
import { ConflictError } from "../errors/conflict.error.js";

export const registerUser = async ({ name, email, password }) => {
  const passwordHash = await argon2.hash(password);

  try {
    return await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ConflictError(
        "Email is already registered",
        "EMAIL_ALREADY_EXISTS",
        {
          email: "Email is already registered"
        }
      );
    }

    throw error;
  }
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const verifyUserPassword = async (password, passwordHash) => {
  return argon2.verify(passwordHash, password);
};