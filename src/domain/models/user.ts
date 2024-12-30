import { Social } from "@shared/constant/config";

import { BaseModel } from "./base";

export interface UserModel extends BaseModel {
    userEmail: string;
    lifePoints: number;
    highestPoint: number;
    highestPointUpdateTimestamp: number;
    lastRegen: number;
    socialLinks: Social[];
    adsWatch: number;
}
