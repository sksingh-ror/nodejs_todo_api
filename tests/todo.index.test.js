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

    expect(responseA.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
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

    expect(responseB.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    });
  });

  it("returns an empty list when the user has no todos", async () => {
    const user = await createUserAndLogin("Empty Todo User");

    const response = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    });
  });

  it("paginates todos using page and limit", async () => {
    const user = await createUserAndLogin("Pagination User");

    for (let i = 1; i <= 5; i++) {
      const response = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({
          title: `Todo ${i}`,
          description: `Description ${i}`
        });

      expect(response.status).toBe(201);
    }

    const pageOne = await request(app)
      .get("/api/v1/todos?page=1&limit=2")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(pageOne.status).toBe(200);

    expect(pageOne.body.data).toHaveLength(2);

    expect(pageOne.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3
    });

    const pageTwo = await request(app)
      .get("/api/v1/todos?page=2&limit=2")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(pageTwo.status).toBe(200);

    expect(pageTwo.body.data).toHaveLength(2);

    expect(pageTwo.body.meta).toEqual({
      page: 2,
      limit: 2,
      total: 5,
      totalPages: 3
    });

    expect(pageOne.body.data[0].id).not.toBe(
      pageTwo.body.data[0].id
    );
  });

  it("rejects an invalid page", async () => {
    const user = await createUserAndLogin("Invalid Page User");

    const response = await request(app)
      .get("/api/v1/todos?page=abc")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.error.code).toBe(
      "VALIDATION_ERROR"
    );
  });

  it("rejects a non-positive page", async () => {
    const user = await createUserAndLogin(
      "Invalid Page Number User"
    );

    const response = await request(app)
      .get("/api/v1/todos?page=0")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.error.code).toBe(
      "VALIDATION_ERROR"
    );
  });

  it("rejects a limit greater than 100", async () => {
    const user = await createUserAndLogin(
      "Invalid Limit User"
    );

    const response = await request(app)
      .get("/api/v1/todos?limit=101")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.error.code).toBe(
      "VALIDATION_ERROR"
    );
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

  it("filters todos by completed status", async () => {
    const user = await createUserAndLogin("Completed Filter User");

    const completedTodo = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Completed Todo",
        description: "This todo is completed"
      });

    const pendingTodo = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Pending Todo",
        description: "This todo is pending"
      });

    expect(completedTodo.status).toBe(201);
    expect(pendingTodo.status).toBe(201);

    await request(app)
      .patch(`/api/v1/todos/${completedTodo.body.data.id}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        completed: true
      });

    const response = await request(app)
      .get("/api/v1/todos?completed=true")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0]).toMatchObject({
      id: completedTodo.body.data.id,
      title: "Completed Todo",
      completed: true,
      userId: user.userId
    });

    expect(response.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    });
  });

  it("filters todos by incomplete status", async () => {
    const user = await createUserAndLogin("Incomplete Filter User");

    const completedTodo = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Completed Todo",
        description: "This todo is completed"
      });

    const pendingTodo = await request(app)
      .post("/api/v1/todos")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        title: "Pending Todo",
        description: "This todo is pending"
      });

    expect(completedTodo.status).toBe(201);
    expect(pendingTodo.status).toBe(201);

    await request(app)
      .patch(`/api/v1/todos/${completedTodo.body.data.id}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        completed: true
      });

    const response = await request(app)
      .get("/api/v1/todos?completed=false")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0]).toMatchObject({
      id: pendingTodo.body.data.id,
      title: "Pending Todo",
      completed: false,
      userId: user.userId
    });

    expect(response.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    });
  });

  it("rejects an invalid completed filter", async () => {
    const user = await createUserAndLogin("Invalid Completed Filter User");

    const response = await request(app)
      .get("/api/v1/todos?completed=yes")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(400);

    expect(response.body.error.code).toBe(
      "VALIDATION_ERROR"
    );
  });

  it("supports completed filtering with pagination", async () => {
    const user = await createUserAndLogin("Filter Pagination User");

    for (let i = 1; i <= 5; i++) {
      const todo = await request(app)
        .post("/api/v1/todos")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({
          title: `Todo ${i}`,
          description: `Description ${i}`
        });

      expect(todo.status).toBe(201);

      if (i <= 3) {
        const update = await request(app)
          .patch(`/api/v1/todos/${todo.body.data.id}`)
          .set("Authorization", `Bearer ${user.accessToken}`)
          .send({
            completed: true
          });

        expect(update.status).toBe(200);
      }
    }

    const response = await request(app)
      .get("/api/v1/todos?completed=true&page=1&limit=2")
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveLength(2);

    expect(
      response.body.data.every((todo) => todo.completed === true)
    ).toBe(true);

    expect(response.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2
    });
  });
});