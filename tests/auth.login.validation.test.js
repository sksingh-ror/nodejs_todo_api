import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/auth/login - invalid credentials", () => {
  it("rejects an invalid password", async () => {
    const email = `invalid-login-${Date.now()}@example.com`;

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Invalid Login User",
        email,
        password: "password123"
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password: "wrong-password"
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      }
    });
  });

  it("rejects a non-existent email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: `does-not-exist-${Date.now()}@example.com`,
        password: "password123"
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      }
    });
  });
});