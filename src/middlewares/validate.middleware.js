import { ValidationError } from "../errors/validation.error.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = {};

      for (const issue of result.error.issues) {
        const field = issue.path.join(".");

        if (!details[field]) {
          details[field] = issue.message;
        }
      }

      throw new ValidationError(details);
    }

    req.body = result.data;

    next();
  };
};