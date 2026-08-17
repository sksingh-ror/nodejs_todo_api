import { prisma } from "../config/database.js";

export const createTodo = async ({ userId, title, description }) => {
  return prisma.todo.create({
    data: {
      userId,
      title,
      description
    },
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const getTodosByUser = async ({ userId, page = 1, limit = 10, completed, search, sort = "createdAt", order = "desc" }) => {
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(completed !== undefined && { completed}),
    ...(search !== undefined && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    })
  };

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        userId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        [sort]: order
      },
      skip,
      take: limit
    }),

    prisma.todo.count({
      where
    })
  ]);

  return {
    todos,
    total
  };
};

export const getTodoById = async ({ id, userId }) => {
  return prisma.todo.findFirst({
    where: {
      id,
      userId
    },
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const updateTodo = async ({ id, userId, data }) => {
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!todo) {
    return null;
  }

  return prisma.todo.update({
    where: {
      id: todo.id
    },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
};

export const deleteTodo = async ({ id, userId }) => {
  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!todo) {
    return null;
  }

  await prisma.todo.delete({
    where: {
      id: todo.id
    }
  });

  return todo;
};