import userRepository from "@api/user/user.repository";
import { decryptFinishPayload } from "@shared/helper/decrypt";
import { sendMail } from "@shared/helper/mail";
import { BadRequestError } from "@shared/lib/http/httpError";

import gamePlayRepository, { GamePlayRepository } from "./gamePlay.repository";

class GamePlayService {
    constructor(private readonly repository: GamePlayRepository) {}

    async joinGame(userEmail: string, userId: string) {
        const user = await userRepository.findByEmail(userEmail);
        if (!user) throw new BadRequestError("Invalid user");
        if (user.lifePoints <= 0)
            throw new BadRequestError("Not enough lifepoint");

        return await this.repository.create(userId, userEmail);
    }

    async finishGame(
        userId: string,
        gamePlayId: string,
        encryptedPayload: string,
    ) {
        const decryptedPayload = decryptFinishPayload(
            userId,
            gamePlayId,
            encryptedPayload,
        );
        if (
            !decryptedPayload ||
            decryptedPayload.userId !== userId ||
            decryptedPayload.gamePlayId !== gamePlayId ||
            decryptedPayload.deadline < Date.now()
        )
            throw new BadRequestError("Invalid payload");

        return await this.repository.finishGame(
            userId,
            decryptedPayload.point,
            gamePlayId,
        );
    }

    async leaderboard() {
        const players = await this.repository.getLeaderBoard();
        return players.map(({ userEmail, highestPoint }) => {
            const [localPart, domain] = userEmail.split("@");
            const hideLength = Math.ceil((2 / 5) * localPart.length);
            const visibleLength = localPart.length - hideLength;

            const visiblePart = localPart.slice(0, Math.min(visibleLength, 4));
            const hiddenPart = "*".repeat(Math.min(hideLength, 5));

            return {
                userEmail: `${visiblePart}${hiddenPart}@${domain}`,
                highestPoint,
            };
        });
    }

    async sendRankingReport() {
        const players = await this.repository.getLeaderBoard(50, true);
        await sendMail(players);
    }
}

const gamePlayService = new GamePlayService(gamePlayRepository);
export default gamePlayService;
