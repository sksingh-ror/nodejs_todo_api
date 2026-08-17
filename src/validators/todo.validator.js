import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title must not be empty")
    .max(200, "Title must not exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),

  completed: z
    .boolean()
    .optional()
})
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided"
  }
);

export const listTodosSchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be an integer")
    .positive("Page must be a positive integer")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .positive("Limit must be a positive integer")
    .max(100, "Limit must not exceed 100")
    .default(10),

  completed: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  search: z
    .string()
    .trim()
    .min(1, "Search must not be empty")
    .max(100, "Search must not exceed 100 characters")
    .optional()
});