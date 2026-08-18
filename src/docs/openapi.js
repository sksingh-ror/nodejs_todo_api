export const openapiSpec = {
  openapi: "3.0.3",

  info: {
    title: "Todo API",
    version: "1.0.0",
    description: "RESTful Todo API built with Node.js, Express, Prisma and PostgreSQL."
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],

  tags: [
    {
      name: "Health",
      description: "Health check endpoints"
    },
    {
      name: "Authentication",
      description: "User registration and authentication"
    },
    {
      name: "Todos",
      description: "Todo management endpoints"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          name: {
            type: "string",
            example: "John Doe"
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com"
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },

      Todo: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          title: {
            type: "string",
            example: "Learn Node.js"
          },
          description: {
            type: "string",
            nullable: true,
            example: "Complete the Node.js API project"
          },
          completed: {
            type: "boolean",
            example: false
          },
          userId: {
            type: "integer",
            example: 1
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          updatedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },

      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: "VALIDATION_ERROR"
              },
              message: {
                type: "string",
                example: "Validation failed"
              },
              details: {
                type: "object",
                additionalProperties: true
              }
            }
          }
        }
      }
    }
  },

  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Creates a new user account.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "John Doe"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "Password123"
                  }
                }
              }
            }
          }
        },

        responses: {
          201: {
            description: "User registered successfully",

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  properties: {
                    data: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          },

          400: {
            description: "Validation error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          409: {
            description: "Email already registered",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },

    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user",
        description: "Authenticates a user and returns a JWT access token.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "Password123"
                  }
                }
              }
            }
          }
        },

        responses: {
          200: {
            description: "Login successful",

            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        user: {
                          $ref: "#/components/schemas/User"
                        },
                        accessToken: {
                          type: "string",
                          example: "eyJhbGciOiJIUzI1NiIs..."
                        }
                      }
                    }
                  }
                }
              }
            }
          },

          400: {
            description: "Validation error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          401: {
            description: "Invalid email or password",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },

    "/api/v1/todos": {
      post: {
        tags: ["Todos"],
        summary: "Create a todo",
        description: "Creates a new todo for the authenticated user.",

        security: [
          {
            bearerAuth: []
          }
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                    example: "Learn Node.js"
                  },
                  description: {
                    type: "string",
                    maxLength: 2000,
                    nullable: true,
                    example: "Complete the Todo API project"
                  }
                }
              }
            }
          }
        },

        responses: {
          201: {
            description: "Todo created successfully",

            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Todo"
                    }
                  }
                }
              }
            }
          },

          400: {
            description: "Validation error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          401: {
            description: "Authentication required",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },

      get: {
        tags: ["Todos"],
        summary: "Get todos",
        description: "Returns todos belonging to the authenticated user.",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            },
            example: 1
          },

          {
            name: "limit",
            in: "query",
            description: "Number of todos per page",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10
            },
            example: 10
          },

          {
            name: "completed",
            in: "query",
            description: "Filter todos by completion status",
            required: false,
            schema: {
              type: "boolean"
            },
            example: false
          }
        ],

        responses: {
          200: {
            description: "Todos retrieved successfully",

            content: {
              "application/json": {
                schema: {
                  type: "object",

                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Todo"
                      }
                    },

                    meta: {
                      type: "object",
                      properties: {
                        page: {
                          type: "integer",
                          example: 1
                        },
                        limit: {
                          type: "integer",
                          example: 10
                        },
                        total: {
                          type: "integer",
                          example: 25
                        },
                        totalPages: {
                          type: "integer",
                          example: 3
                        }
                      }
                    }
                  }
                }
              }
            }
          },

          401: {
            description: "Authentication required",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }

    },

    "/api/v1/todos/{id}": {
      get: {
        tags: ["Todos"],
        summary: "Get a todo",
        description: "Returns a single todo belonging to the authenticated user.",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Todo ID",
            schema: {
              type: "integer",
              minimum: 1
            },
            example: 1
          }
        ],

        responses: {
          200: {
            description: "Todo retrieved successfully",

            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Todo"
                    }
                  }
                }
              }
            }
          },

          401: {
            description: "Authentication required",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          404: {
            description: "Todo not found",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },

      patch: {
        tags: ["Todos"],
        summary: "Update a todo",
        description: "Updates a todo belonging to the authenticated user.",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Todo ID",
            schema: {
              type: "integer",
              minimum: 1
            },
            example: 1
          }
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  title: {
                    type: "string",
                    minLength: 1,
                    maxLength: 200,
                    example: "Learn advanced Node.js"
                  },

                  description: {
                    type: "string",
                    maxLength: 2000,
                    nullable: true,
                    example: "Complete authentication and API documentation"
                  },

                  completed: {
                    type: "boolean",
                    example: true
                  }
                }
              }
            }
          }
        },

        responses: {
          200: {
            description: "Todo updated successfully",

            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: "#/components/schemas/Todo"
                    }
                  }
                }
              }
            }
          },

          400: {
            description: "Validation error",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          401: {
            description: "Authentication required",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          404: {
            description: "Todo not found",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      },

      delete: {
        tags: ["Todos"],
        summary: "Delete a todo",
        description: "Deletes a todo belonging to the authenticated user.",

        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Todo ID",
            schema: {
              type: "integer",
              minimum: 1
            },
            example: 1
          }
        ],

        responses: {
          204: {
            description: "Todo deleted successfully"
          },

          401: {
            description: "Authentication required",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          },

          404: {
            description: "Todo not found",

            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    }
  }
};