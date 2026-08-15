import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createUserAndLogin } from "./helpers/auth.js";

describe("GET /api/v1/todos", () => {
  it("returns only todos belonging to the authenticated user", async () => {
    const userA = await createUserAndLogin("Todo User A");
    const userB = await createUserAndLogin("Todo User B");

    const todoA = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${userA.accessToken}`)
      .send({
        title: "User A Todo",
        description: "Belongs to User A"
      });

    const todoB = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${userB.accessToken}`)
      .send({
        title: "User B Todo",
        description: "Belongs to User B"
      });

    expect(todoA.status).toBe(201);
    expect(todoB.status).toBe(201);

    const responseA = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", `Bearer ${userA.accessToken}`);

    expect(responseA.status).toBe(200);

    expect(responseA.body.data).toHaveLength(1);

    expect(responseA.body.data[0]).toMatchObject({
      id: todoA.body.data.id,
      title: "User A Todo",
      userId: userA.userId
    });

    const responseB = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", `Bearer ${userB.accessToken}`);

    expect(responseB.status).toBe(200);

    expect(responseB.body.data).toHaveLength(1);

    expect(responseB.body.data[0]).toMatchObject({
      id: todoB.body.data.id,
      title: "User B Todo",
      userId: userB.userId
    });
  });

  it("returns an empty list when the user has no todos", async () => {
    const user = await createUserAndLogin("Empty Todo User");

    const response = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: []
    });
  });

  it("rejects unauthenticated requests", async () => {
    const response = await request(app)
      .get("/api/v1/todos");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  });
});