import { AppError } from "./app.error.js";

export class ConflictError extends AppError {
  constructor(message, code = "RESOURCE_ALREADY_EXISTS", details = null) {
    super(message, 409, code, details);

    this.name = "ConflictError";
  }
}