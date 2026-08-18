# Node.js Todo API

A RESTful Todo API built with Node.js, Express, Prisma, PostgreSQL and JWT authentication.

The project follows a modular backend structure with controllers, services, validators, middleware and centralized error handling.

## Tech Stack

- Node.js
- Express 5
- PostgreSQL
- Prisma ORM
- JWT (`jose`)
- Argon2
- Zod
- Vitest
- Supertest
- Swagger / OpenAPI
- dotenv

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Password hashing with Argon2
- Duplicate email protection
- Request validation

### Todo Management

- Create Todo
- List authenticated user's Todos
- Get Todo by ID
- Update Todo
- Delete Todo
- User-level Todo authorization
- Pagination
- Completed status filtering
- Search
- Sorting

### API Quality

- Request validation using Zod
- Centralized error handling
- Consistent API error responses
- Protected routes
- Automated API tests
- PostgreSQL database
- Prisma migrations
- Swagger/OpenAPI documentation

## Project Structure

```text
nodejs_todo_api/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── todo.controller.js
│   │
│   ├── docs/
│   │   └── openapi.js
│   │
│   ├── errors/
│   │   ├── authentication.error.js
│   │   ├── conflict.error.js
│   │   ├── not-found.error.js
│   │   └── validation.error.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validate-id.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── todo.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── todo.service.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── todo.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── helpers/
│   ├── auth.*.test.js
│   ├── todo.*.test.js
│   └── health.test.js
│
├── .env
├── .env.test
├── prisma.config.ts
├── vitest.config.js
├── package.json
└── README.md
