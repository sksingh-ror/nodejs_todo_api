import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/v1/auth/me", () => {
  it("returns the authenticated user's ID", async () => {
    const email = `me-${Date.now()}@example.com`;
    const password = "password123";

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Auth Me User",
        email,
        password
      });

    expect(registerResponse.status).toBe(201);

    const userId = registerResponse.body.data.id;

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password
      });

    expect(loginResponse.status).toBe(200);

    const accessToken = loginResponse.body.data.accessToken;

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      data: {
        userId
      }
    });
  });

  it("rejects a request without an access token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });

  it("rejects an invalid access token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired token"
      }
    });
  });
});