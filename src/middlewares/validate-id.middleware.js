import { ValidationError } from "../errors/validation.error.js";

export const validateId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError({
      id: "ID must be a positive integer"
    });
  }

  req.params.id = id;

  next();
};