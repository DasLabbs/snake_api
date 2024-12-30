import { BaseModel } from "./base";

export type GamePlayStatus = "initialized" | "finished";

export interface GamePlayModel extends BaseModel {
    userId: string;
    status: GamePlayStatus;
    point: number;
}
