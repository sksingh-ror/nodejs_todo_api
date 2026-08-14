import { AppError } from "./app.error.js";

export class AuthenticationError extends AppError {
  constructor(
    message = "Invalid email or password",
    code = "INVALID_CREDENTIALS"
  ) {
    super(message, 401, code);

    this.name = "AuthenticationError";
  }
}