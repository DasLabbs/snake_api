import config from "@config/index";
import logger from "@shared/lib/logger";
import * as lodash from "lodash";
import { v4 as uuidV4 } from "uuid";
import { NextFunction, Request, Response } from "express";

export const requestTracker = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    req.headers["x-request-id"] = req.headers["x-request-id"] ?? uuidV4();
    const loggerFields = ["body"];
    if (config.nodeEnv === "DEV") {
        loggerFields.forEach((field) =>
            requestLogger(lodash.get(req, field), field),
        );
    }
    next();
};

const requestLogger = (reqField: object | null, fieldName: string) => {
    if (reqField && Object.keys(reqField).length > 0) {
        logger.debug({ field: fieldName, value: reqField });
    }
};
