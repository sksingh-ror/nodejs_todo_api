import { getAllUsers } from "../services/user.service.js";

export const getUsers = async (req, res) => {
  const users = await getAllUsers();

  res.json({
    data: users
  });
};

