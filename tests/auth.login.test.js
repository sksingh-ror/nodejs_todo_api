import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/auth/login", () => {
  it("logs in an existing user and returns an access token", async () => {
    const email = `login-${Date.now()}@example.com`;
    const password = "password123";

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Login Test User",
        email,
        password
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password
      });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveProperty("accessToken");
    expect(typeof response.body.data.accessToken).toBe("string");
    expect(response.body.data.accessToken.length).toBeGreaterThan(0);
  });
});