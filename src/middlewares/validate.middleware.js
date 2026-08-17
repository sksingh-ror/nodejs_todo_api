import { ValidationError } from "../errors/validation.error.js";

export const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = {};

      for (const issue of result.error.issues) {
        const field = issue.path.length > 0
          ? issue.path.join(".")
          : "_form";

        if (!details[field]) {
          details[field] = issue.message;
        }
      }

      throw new ValidationError(details);
    }

    if (target === "query") {
      req.validatedQuery = result.data;
    } else {
      req[target] = result.data;
    }

    next();
  };
};