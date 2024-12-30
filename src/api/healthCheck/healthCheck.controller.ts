import { OkResponse } from "@shared/decorators/response";
import { NextFunction, Request, Response } from "express";

import healthCheckService from "./healthCheck.service";

class HealthCheckController {
    @OkResponse()
    async get(_req: Request, _res: Response, _next: NextFunction) {
        return await healthCheckService.get();
    }
}

const healthCheckController = new HealthCheckController();
export default healthCheckController;
