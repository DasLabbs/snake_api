import express from "express";

import gamePlayRouter from "./gamePlay/gamePlay.route";
import healthCheckRouter from "./healthCheck/healthCheck.route";
import userRouter from "./user/user.route";

const router = express.Router();

router.use("/health_check", healthCheckRouter);
router.use("/user", userRouter);
router.use("/game", gamePlayRouter);

export default router;
