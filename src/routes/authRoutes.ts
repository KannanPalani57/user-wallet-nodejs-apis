
import express from "express";
import {
    createSessionHandler,
    isUserTokenValid
} from "../controllers/authController";
import validateResource from "../middlewares/validateResource";
import {
    createSessionSchema,
} from "../schemas/authSchema";

const router = express.Router();


router.post(
    "/auth/login",
    validateResource(createSessionSchema),
    createSessionHandler
);




router.get("/auth/isUserTokenValid", isUserTokenValid)



export default router;