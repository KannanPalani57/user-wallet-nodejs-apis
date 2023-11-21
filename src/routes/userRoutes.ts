import express from "express";
import { createUserHandler, getUser } from "../controllers/userController";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schemas/authSchema";
import { createUserSchema } from "../schemas/userSchema";

const router = express.Router();

router.post("/register", validateResource(createUserSchema), createUserHandler);

router.get("/me", requireUser, getUser);

export default router;
