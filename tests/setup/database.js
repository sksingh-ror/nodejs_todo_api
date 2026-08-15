import { beforeEach, afterAll } from "vitest";
import { prisma } from "../../src/config/database.js";

beforeEach(async () => {
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});