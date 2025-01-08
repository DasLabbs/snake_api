import { Social, USER_MAX_LIFEPOINT } from "@shared/constant/config";
import { model, Schema } from "dynamoose";
import { v4 as uuidv4 } from "uuid";

import { BaseModel } from "./base";

export interface UserModel extends BaseModel {
    userEmail: string;
    lifePoints: number;
    lastRegen: number;
    socialLinks: Social[];
    adsWatch: number;
}

const userSchema = new Schema(
    {
        id: {
            type: String,
            hashKey: true,
            default: uuidv4(),
        },
        userEmail: {
            type: String,
            index: {
                type: "global",
            },
        },
        lastRegen: {
            type: Number,
            default: Date.now(),
        },
        lifePoints: {
            type: Number,
            default: USER_MAX_LIFEPOINT,
        },
        socialLinks: {
            type: Array,
            schema: [String],
            default: [],
        },
        adsWatch: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

const userModel = model("User", userSchema);
export default userModel;
