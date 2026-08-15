import { AppError } from "./app.error.js";

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found",
    code = "RESOURCE_NOT_FOUND"
  ) {
    super(message, 404, code);

    this.name = "NotFoundError";
  }
}