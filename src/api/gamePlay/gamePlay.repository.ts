import firebaseDb from "@domain/db";
import { GamePlayModel, GamePlayStatus } from "@domain/models/gamePlay";
import { REGEN_TIME, USER_MAX_LIFEPOINT } from "@shared/constant/config";
import { BadRequestError } from "@shared/lib/http/httpError";
import { CollectionReference } from "firebase-admin/firestore";

export class GamePlayRepository {
    constructor(private readonly collection: CollectionReference) {}

    async create(userId: string) {
        const defaultGamePlay = {
            userId,
            status: "initialized",
            point: 0,
        };

        const document = await this.collection.add(defaultGamePlay);
        return {
            id: document.id,
            ...defaultGamePlay,
        } as GamePlayModel;
    }

    async getUserTopPoint(userId: string) {
        const snapshot = await this.collection
            .where("userId", "==", userId)
            .orderBy("point", "desc")
            .limit(1)
            .get();
        if (snapshot.empty) return 0;
        const [topPointGamePlay] = snapshot.docs.map(
            (e) =>
                ({
                    id: e.id,
                    ...e.data(),
                }) as GamePlayModel,
        );
        return topPointGamePlay.point;
    }

    async finishGame(userId: string, point: number, gamePlayId: string) {
        const gamePlay = await this.collection.doc(gamePlayId).get();
        if (!gamePlay.exists) throw new BadRequestError("Invalid game play");

        const { status } = gamePlay.data() as { status: GamePlayStatus };
        if (status !== "initialized")
            throw new BadRequestError("Invalid game play");

        return await firebaseDb.runTransaction(async (t) => {
            const userRef = firebaseDb.collection("user").doc(userId);
            const gamePlayRef = firebaseDb
                .collection("game_play")
                .doc(gamePlayId);

            const user = await t.get(userRef);
            const {
                highestPoint,
                lifePoints,
                highestPointUpdateTimestamp,
                lastRegen,
            } = user.data()! as {
                lifePoints: number;
                highestPoint: number;
                highestPointUpdateTimestamp: number;
                lastRegen: number;
            };

            const updateLastRegen =
                lifePoints == USER_MAX_LIFEPOINT
                    ? Date.now()
                    : lifePoints == 0
                      ? lastRegen + REGEN_TIME
                      : lastRegen;

            t.update(userRef, {
                lifePoints: lifePoints != 0 ? lifePoints - 1 : 0,
                highestPoint: point > highestPoint ? point : highestPoint,
                highestPointUpdateTimestamp:
                    point > highestPoint
                        ? Date.now()
                        : highestPointUpdateTimestamp,
                lastRegen: updateLastRegen,
            });
            t.update(gamePlayRef, { point, status: "finished" });
            return {
                gamePlayId,
                userId,
                point,
                lastRegen: updateLastRegen,
            };
        });
    }
}

const gamePlayRepository = new GamePlayRepository(
    firebaseDb.collection("game_play"),
);
export default gamePlayRepository;
