import { Router } from "express";
import { getTodos } from "../controllers/todo.controller.js";

const router = Router();

router.get("/", getTodos);

export default router;