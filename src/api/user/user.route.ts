import {
    authorizeAccessToken,
    authorizeRefreshToken,
} from "@shared/middlewares/authorize";
import { decryptBody } from "@shared/middlewares/decryptBody";
import { validator } from "@shared/middlewares/validator";
import { asyncWrapper } from "@shared/utils/asyncWrapper";
import express from "express";

import userController from "./user.controller";
import {
    userIncreaseLifePointSchema,
    userLinkSocialSchema,
    userLoginSchema,
} from "./user.schema";

const userRouter = express.Router();

userRouter.post(
    "/login",
    validator({ body: userLoginSchema }),
    asyncWrapper(userController.login),
);
userRouter.get("/", authorizeAccessToken, asyncWrapper(userController.getUser));
userRouter.get(
    "/refresh",
    authorizeRefreshToken,
    asyncWrapper(userController.handleRefreshToken),
);
userRouter.post(
    "/social",
    validator({
        body: userLinkSocialSchema,
    }),
    authorizeAccessToken,
    asyncWrapper(userController.linkSocial),
);
userRouter.post(
    "/life",
    validator({ body: userIncreaseLifePointSchema }),
    authorizeAccessToken,
    decryptBody,
    asyncWrapper(userController.increaseUserLifePoint),
);

export default userRouter;
