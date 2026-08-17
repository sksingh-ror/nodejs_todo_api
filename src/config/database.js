import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

if (
  process.env.NODE_ENV === "test" &&
  !databaseUrl.includes("nodejs_todo_api_test")
) {
  throw new Error(
    "Test environment must use nodejs_todo_api_test database"
  );
}

const adapter = new PrismaPg({
  connectionString: databaseUrl
});

export const prisma = new PrismaClient({
  adapter
});