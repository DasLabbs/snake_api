import userRepository from "@api/user/user.repository";
import gamePlayModel from "@domain/models/gamePlay";
import { getFriday6pmOfWeek } from "@shared/helper/date";
import { BadRequestError } from "@shared/lib/http/httpError";

export class GamePlayRepository {
    constructor(private readonly model = gamePlayModel) {}

    async create(userId: string, userEmail: string) {
        return await this.model.create({
            userId,
            userEmail,
        });
    }

    async finishGame(userId: string, point: number, gamePlayId: string) {
        const gamePlay = await this.model.get(gamePlayId); // Using `get` to fetch by primary key
        if (!gamePlay || gamePlay.status !== "initialized") {
            throw new BadRequestError("Invalid game play");
        }

        const updatedUser = await userRepository.decreaseUserLifePoint(userId);

        gamePlay.point = point;
        gamePlay.status = "finished";
        await gamePlay.save(); // Save the updated gamePlay

        return { gamePlayId, userId, point, lastRegen: updatedUser.lastRegen };
    }

    async getLeaderBoard(limit: number = 20, last = false) {
        // Step 1: Scan for gamePlays with the given filter
        const gamePlays = await this.model
            .scan()
            .where("createdAt")
            .gt(getFriday6pmOfWeek(last)) // Filter by date
            .where("status")
            .eq("finished") // Filter by status
            .exec(); // Execute scan

        const res: {
            [key: string]: {
                userEmail: string;
                highestPoint: number;
                createdAt: Date;
            };
        } = {};

        // Step 2: Loop through gamePlays and aggregate the leaderboard
        for (const gamePlay of gamePlays) {
            if (!res[gamePlay.userId]) {
                res[gamePlay.userId] = {
                    highestPoint: 0,
                    userEmail: gamePlay.userEmail,
                    createdAt: gamePlay.createdAt,
                };
            }

            // Update the highest point for the user
            res[gamePlay.userId].highestPoint = Math.max(
                res[gamePlay.userId].highestPoint,
                gamePlay.point,
            );
        }

        // Step 3: Sort the leaderboard by highestPoint in descending order, then by createdAt
        const sortedLeaderBoard = Object.values(res).sort((a, b) => {
            if (b.highestPoint === a.highestPoint) {
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                ); // Sort by createdAt if points are the same
            }
            return b.highestPoint - a.highestPoint; // Sort by highestPoint
        });

        // Step 4: Return the top `limit` players
        return last ? sortedLeaderBoard : sortedLeaderBoard.slice(0, limit);
    }
}

const gamePlayRepository = new GamePlayRepository();
export default gamePlayRepository;
