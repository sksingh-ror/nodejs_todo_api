import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/auth/register", () => {
  it("registers a new user successfully", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "password123"
      });

    expect(response.status).toBe(201);

    expect(response.body.data).toMatchObject({
      name: "Test User"
    });

    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("email");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");

    expect(response.body.data).not.toHaveProperty("password");
  });
});