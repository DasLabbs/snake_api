import { Social } from "@shared/constant/config";
import { OkResponse } from "@shared/decorators/response";
import { getBody, getPayload } from "@shared/lib/http";
import { NextFunction, Request, Response } from "express";

import userService from "./user.service";

class UserController {
    @OkResponse()
    async login(req: Request, _res: Response, _next: NextFunction) {
        const { userEmail } = getBody<{ userEmail: string }>(req);
        return await userService.login(userEmail);
    }

    @OkResponse()
    async getUser(req: Request, _res: Response, _next: NextFunction) {
        const { userEmail } = getPayload(req);
        return await userService.getUser(userEmail);
    }

    @OkResponse()
    async handleRefreshToken(
        req: Request,
        _res: Response,
        _next: NextFunction,
    ) {
        const { userEmail, id } = getPayload(req);
        return await userService.handleRefreshToken({ id, userEmail });
    }

    @OkResponse()
    async linkSocial(req: Request, _res: Response, _next: NextFunction) {
        const { id } = getPayload(req);
        const { social } = getBody<{ social: Social }>(req);
        return await userService.linkSocial(id, social);
    }

    @OkResponse()
    async increaseUserLifePoint(
        req: Request,
        _res: Response,
        _next: NextFunction,
    ) {
        const { id } = getPayload(req);
        const { payload } = getBody<{ payload: string }>(req);
        return await userService.addLifePointWatchAds(id, payload);
    }
}

const userController = new UserController();
export default userController;
