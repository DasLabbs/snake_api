import lodash from "lodash";
import { Request } from "express";

import { UserTokenPayload } from "../jwt";

export const getQuery = <T>(req: Request) => {
    return req.query as unknown as T;
};

export const getParams = <T>(req: Request) => {
    return req.params as unknown as T;
};

export const getBody = <T>(req: Request) => {
    return req.body as unknown as T;
};

export const getPayload = <T = UserTokenPayload>(req: Request) => {
    return lodash.get(req, "user") as T;
};
