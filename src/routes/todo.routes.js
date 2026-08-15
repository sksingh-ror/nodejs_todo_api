import { Router } from "express";
import {
  create,
  index,
  show,
  update,
  destroy
} from "../controllers/todo.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateId } from "../middlewares/validate-id.middleware.js";
import {
  createTodoSchema,
  updateTodoSchema
} from "../validators/todo.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createTodoSchema),
  create
);

router.get(
  "/",
  authenticate,
  index
);

router.get(
  "/:id",
  authenticate,
  validateId,
  show
);

router.patch(
  "/:id",
  authenticate,
  validateId,
  validate(updateTodoSchema),
  update
);

router.delete(
  "/:id",
  authenticate,
  validateId,
  destroy
);

export default router;