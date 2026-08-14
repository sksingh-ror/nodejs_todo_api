import { AppError } from "./app.error.js";

export class ValidationError extends AppError {
  constructor(details) {
    super(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      details
    );

    this.name = "ValidationError";
  }
}