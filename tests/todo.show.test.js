import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createUserAndLogin } from "./helpers/auth.js";

describe("GET /api/v1/todos/:id", () => {
  it("returns a todo belonging to the authenticated user", async () => {
    const user = await createUserAndLogin("Todo Show User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Learn Node.js",
        description: "Test GET todo by ID"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toMatchObject({
      id: todoId,
      title: "Learn Node.js",
      description: "Test GET todo by ID",
      completed: false,
      userId: user.userId
    });
  });

  it("returns 404 when the todo does not exist", async () => {
    const user = await createUserAndLogin("Missing Todo User");

    const response = await request(app)
      .get("/api/v1/todos/999999")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: "TODO_NOT_FOUND",
        message: "Todo not found"
      }
    });
  });

  it("does not allow another user to access the todo", async () => {
    const owner = await createUserAndLogin("Todo Owner");
    const otherUser = await createUserAndLogin("Other Todo User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({
        title: "Private Todo",
        description: "Belongs to another user"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${otherUser.accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: "TODO_NOT_FOUND",
        message: "Todo not found"
      }
    });
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .get("/api/v1/todos/1");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });

  it("rejects an invalid todo ID", async () => {
    const user = await createUserAndLogin("Invalid ID User");

    const response = await request(app)
      .get("/api/v1/todos/abc")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          id: "ID must be a positive integer"
        }
      }
    });
  });
});