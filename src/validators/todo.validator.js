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