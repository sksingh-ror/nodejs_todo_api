import request from "supertest";
import app from "../../src/app.js";

export const createUserAndLogin = async (name = "Test User") => {
  const email = `test-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;

  const password = "password123";

  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      name,
      email,
      password
    });

  if (registerResponse.status !== 201) {
    throw new Error(
      `Test user registration failed: ${JSON.stringify(
        registerResponse.body
      )}`
    );
  }

  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email,
      password
    });

  if (loginResponse.status !== 200) {
    throw new Error(
      `Test user login failed: ${JSON.stringify(
        loginResponse.body
      )}`
    );
  }

  return {
    userId: registerResponse.body.data.id,
    accessToken: loginResponse.body.data.accessToken
  };
};