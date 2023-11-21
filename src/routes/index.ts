import express from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import walletRoutes from "./walletRoutes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use("/user", userRoutes);
router.use(authRoutes);

router.use("/wallet", walletRoutes);

export default router;
