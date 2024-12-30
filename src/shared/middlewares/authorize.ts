import { UnauthorizedError } from "@shared/lib/http/httpError";
import { verifyAccessToken, verifyRefreshToken } from "@shared/lib/jwt";
import lodash from "lodash";
import { NextFunction, Request, Response } from "express";

export const authorizeAccessToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) next(new UnauthorizedError());
    try {
        const payload = verifyAccessToken(token!);
        lodash.set(req, "user", payload);
        next();
    } catch {
        next(new UnauthorizedError());
    }
};

export const authorizeRefreshToken = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) next(new UnauthorizedError());
    try {
        const payload = verifyRefreshToken(token!);
        lodash.set(req, "user", payload);
        next();
    } catch {
        next(new UnauthorizedError());
    }
};
