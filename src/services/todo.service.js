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

export const getTodosByUser = async (userId) => {
  return prisma.todo.findMany({
    where: {
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
    },
    orderBy: {
      createdAt: "desc"
    }
  });
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