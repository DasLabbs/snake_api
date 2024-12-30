import { OkResponse } from "@shared/decorators/response";
import { getBody, getParams, getPayload } from "@shared/lib/http";
import { NextFunction, Request, Response } from "express";

import gamePlayService from "./gamePlay.service";

class GamePlayController {
    @OkResponse()
    async joinGame(req: Request, _res: Response, _next: NextFunction) {
        const { userEmail, id } = getPayload(req);
        return await gamePlayService.joinGame(userEmail, id);
    }

    @OkResponse()
    async finishGame(req: Request, _res: Response, _next: NextFunction) {
        const { id } = getPayload(req);
        const { gamePlayId } = getParams<{ gamePlayId: string }>(req);
        const { payload } = getBody<{ payload: string }>(req);
        return await gamePlayService.finishGame(id, gamePlayId, payload);
    }

    @OkResponse()
    async getGamePlayLeaderboard(
        _req: Request,
        _res: Response,
        _next: NextFunction,
    ) {
        return await gamePlayService.leaderboard();
    }
}

const gamePlayController = new GamePlayController();
export default gamePlayController;
