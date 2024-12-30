import config from "@config/index";
import * as jwt from "jsonwebtoken";

export interface UserTokenPayload {
    id: string;
    userEmail: string;
}

export const generateTokens = (payload: UserTokenPayload) => {
    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    const payload = jwt.verify(token, config.jwtAccessSecret);
    return payload as UserTokenPayload;
};

export const verifyRefreshToken = (token: string) => {
    const payload = jwt.verify(token, config.jwtRefreshSecret);
    return payload as UserTokenPayload;
};
