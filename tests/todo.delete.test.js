import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createUserAndLogin } from "./helpers/auth.js";

describe("DELETE /api/v1/todos/:id", () => {
  it("deletes a todo successfully", async () => {
    const user = await createUserAndLogin("Todo Delete User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Todo To Delete",
        description: "This todo should be deleted"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it("returns 404 when deleting a todo that does not exist", async () => {
    const user = await createUserAndLogin("Missing Delete User");

    const response = await request(app)
      .delete("/api/v1/todos/999999")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: "TODO_NOT_FOUND",
        message: "Todo not found"
      }
    });
  });

  it("does not allow another user to delete the todo", async () => {
    const owner = await createUserAndLogin("Todo Delete Owner");
    const otherUser = await createUserAndLogin("Other Delete User");

    const createResponse = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({
        title: "Private Todo",
        description: "Should not be deleted by another user"
      });

    expect(createResponse.status).toBe(201);

    const todoId = createResponse.body.data.id;

    const response = await request(app)
      .delete(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${otherUser.accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: "TODO_NOT_FOUND",
        message: "Todo not found"
      }
    });

    // Verify that the owner can still access the todo.
    const ownerResponse = await request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    expect(ownerResponse.status).toBe(200);

    expect(ownerResponse.body.data).toMatchObject({
      id: todoId,
      title: "Private Todo",
      userId: owner.userId
    });
  });

  it("rejects an invalid todo ID", async () => {
    const user = await createUserAndLogin("Invalid Delete ID User");

    const response = await request(app)
      .delete("/api/v1/todos/abc")
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

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .delete("/api/v1/todos/1");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });
});