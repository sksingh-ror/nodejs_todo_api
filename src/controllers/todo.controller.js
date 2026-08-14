import { getAllTodos } from "../services/todo.service.js";

export const getTodos = async (req, res) => {
  const todos = await getAllTodos();

  res.json({
    data: todos
  });
};