import { authorizeAccessToken } from "@shared/middlewares/authorize";
import { decryptBody } from "@shared/middlewares/decryptBody";
import { validator } from "@shared/middlewares/validator";
import { asyncWrapper } from "@shared/utils/asyncWrapper";
import express from "express";

import gamePlayController from "./gamePlay.controller";
import {
    finishGameBodySchema,
    finishGameParamsSchema,
} from "./gamePlay.schema";

const gamePlayRouter = express.Router();

gamePlayRouter.post(
    "/start",
    authorizeAccessToken,
    asyncWrapper(gamePlayController.joinGame),
);
gamePlayRouter.post(
    "/finish/:gamePlayId",
    validator({
        params: finishGameParamsSchema,
        body: finishGameBodySchema,
    }),
    authorizeAccessToken,
    decryptBody,
    asyncWrapper(gamePlayController.finishGame),
);
gamePlayRouter.get(
    "/leader",
    asyncWrapper(gamePlayController.getGamePlayLeaderboard),
);

export default gamePlayRouter;
