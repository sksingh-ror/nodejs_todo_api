import {
  createTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
  deleteTodo
} from "../services/todo.service.js";

import { NotFoundError } from "../errors/not-found.error.js";

export const create = async (req, res) => {
  const { title, description } = req.body;

  const todo = await createTodo({
    userId: req.userId,
    title,
    description
  });

  res.status(201).json({
    data: todo
  });
};

export const index = async (req, res) => {
  const todos = await getTodosByUser(req.userId);

  res.json({
    data: todos
  });
};

export const show = async (req, res) => {
  const todo = await getTodoById({
    id: req.params.id,
    userId: req.userId
  });

  if (!todo) {
    throw new NotFoundError(
      "Todo not found",
      "TODO_NOT_FOUND"
    );
  }

  res.json({
    data: todo
  });
};

export const update = async (req, res) => {
  const todo = await updateTodo({
    id: req.params.id,
    userId: req.userId,
    data: req.body
  });

  if (!todo) {
    throw new NotFoundError(
      "Todo not found",
      "TODO_NOT_FOUND"
    );
  }

  res.json({
    data: todo
  });
};

export const destroy = async (req, res) => {
  const todo = await deleteTodo({
    id: req.params.id,
    userId: req.userId
  });

  if (!todo) {
    throw new NotFoundError(
      "Todo not found",
      "TODO_NOT_FOUND"
    );
  }

  res.status(204).send();
};