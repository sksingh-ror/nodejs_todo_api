import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/auth/register - duplicate email", () => {
  it("returns an email already exists error", async () => {
    const email = `duplicate-${Date.now()}@example.com`;

    const firstResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Duplicate Test User",
        email,
        password: "password123"
      });

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Another User",
        email,
        password: "password123"
      });

    expect(secondResponse.status).toBe(409);

    expect(secondResponse.body).toEqual({
      error: {
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email is already registered",
        details: {
          email: "Email is already registered"
        }
      }
    });
  });
});