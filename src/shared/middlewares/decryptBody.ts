import config from "@config/index";
import { getBody } from "@shared/lib/http";
import { BadRequestError } from "@shared/lib/http/httpError";
import CryptoJS from "crypto-js";
import { NextFunction, Request, Response } from "express";

export const decryptBody = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    try {
        const { payload } = getBody<{ payload: string }>(req);
        const bytes = CryptoJS.AES.decrypt(payload, config.encryptKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        req.body = { payload: decrypted };

        next();
    } catch {
        next(new BadRequestError("Invalid payload"));
    }
};
