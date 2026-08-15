import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/auth/register - validation", () => {
  it("returns validation errors for invalid input", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "A",
        email: "invalid-email",
        password: "123"
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          name: "Name must be at least 2 characters",
          email: "Invalid email address",
          password: "Password must be at least 8 characters"
        }
      }
    });
  });
});