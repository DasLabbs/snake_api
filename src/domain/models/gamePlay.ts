import { model, Schema } from "dynamoose";
import { v4 as uuidv4 } from "uuid";

import { BaseModel } from "./base";

export type GamePlayStatus = "initialized" | "finished";

export interface GamePlayModel extends BaseModel {
    userId: string;
    status: GamePlayStatus;
    point: number;
}

const gamePlaySchema = new Schema(
    {
        id: {
            type: String,
            hashKey: true,
            default: () => uuidv4(),
        },
        point: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            default: "initialized",
        },
        userEmail: String,
        userId: String,
    },
    {
        timestamps: true,
    },
);

const gamePlayModel = model("GamePlay", gamePlaySchema);
export default gamePlayModel;
