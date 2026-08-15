import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /api/v1/todos", () => {
  it("creates a todo for the authenticated user", async () => {
    const email = `todo-create-${Date.now()}@example.com`;
    const password = "password123";

    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Todo Create User",
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
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Learn Node.js",
        description: "Write automated tests"
      });

    expect(response.status).toBe(201);

    expect(response.body.data).toMatchObject({
      title: "Learn Node.js",
      description: "Write automated tests",
      completed: false,
      userId
    });

    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("createdAt");
    expect(response.body.data).toHaveProperty("updatedAt");
  });

  it("rejects todo creation without authentication", async () => {
    const response = await request(app)
      .post("/api/v1/todos")
      .send({
        title: "Unauthorized Todo",
        description: "This should not be created"
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });

  it("rejects an invalid todo", async () => {
    const email = `todo-validation-${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Todo Validation User",
        email,
        password
      });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password
      });

    const accessToken = loginResponse.body.data.accessToken;

    const response = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: ""
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          title: "Title is required"
        }
      }
    });
  });
});