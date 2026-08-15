import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createUserAndLogin } from "./helpers/auth.js";

describe("PATCH /api/v1/todos/:id", () => {
  it("updates a todo successfully", async () => {
    const user = await createUserAndLogin("Todo Update User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Learn Node.js",
        description: "Original description"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Learn Node.js Properly",
        completed: true
      });

    expect(response.status).toBe(200);

    expect(response.body.data).toMatchObject({
      id: todoId,
      title: "Learn Node.js Properly",
      description: "Original description",
      completed: true,
      userId: user.userId
    });
  });

  it("supports partial updates", async () => {
    const user = await createUserAndLogin("Partial Update User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Original Title",
        description: "Original Description"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        completed: true
      });

    expect(response.status).toBe(200);

    expect(response.body.data).toMatchObject({
      id: todoId,
      title: "Original Title",
      description: "Original Description",
      completed: true,
      userId: user.userId
    });
  });

  it("rejects an empty update", async () => {
    const user = await createUserAndLogin("Empty Update User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Test Todo"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: {
          _form: "At least one field must be provided"
        }
      }
    });
  });

  it("does not allow another user to update the todo", async () => {
    const owner = await createUserAndLogin("Todo Update Owner");
    const otherUser = await createUserAndLogin("Other Update User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({
        title: "Private Todo",
        description: "Owner's todo"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${otherUser.accessToken}`)
      .send({
        completed: true
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: "TODO_NOT_FOUND",
        message: "Todo not found"
      }
    });
  });

  it("rejects an invalid todo ID", async () => {
    const user = await createUserAndLogin("Invalid Update ID User");

    const response = await request(app)
      .patch("/api/v1/todos/abc")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        completed: true
      });

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

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .patch("/api/v1/todos/1")
      .send({
        completed: true
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });
});