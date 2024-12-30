import firebaseDb from "@domain/db";
import { UserModel } from "@domain/models/user";
import {
    REGEN_TIME,
    Social,
    USER_MAX_LIFEPOINT,
} from "@shared/constant/config";
import { getMondayStartOfWeek } from "@shared/helper/date";
import { BadRequestError } from "@shared/lib/http/httpError";
import { CollectionReference } from "firebase-admin/firestore";

export class UserRepository {
    constructor(private readonly collection: CollectionReference) {}

    async create(userEmail: string) {
        const defaultUser: Partial<UserModel> = {
            userEmail,
            lifePoints: 6,
            highestPoint: 0,
            highestPointUpdateTimestamp: Date.now(),
            lastRegen: Date.now(),
            socialLinks: [],
            adsWatch: 0,
        };

        const document = await this.collection.add(defaultUser);

        return {
            id: document.id,
            ...defaultUser,
        } as UserModel;
    }

    async findByEmail(userEmail: string): Promise<UserModel | null> {
        const snapshot = await this.collection
            .where("userEmail", "==", userEmail)
            .get();
        if (snapshot.empty) return null;
        const [user]: UserModel[] = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            } as UserModel;
        });

        if (
            user.lastRegen + REGEN_TIME <= Date.now() &&
            user.lifePoints < USER_MAX_LIFEPOINT
        ) {
            user.lifePoints = Math.min(user.lifePoints + 1, USER_MAX_LIFEPOINT);
            user.lastRegen += REGEN_TIME;
        }

        return user;
    }

    async findByUserId(userId: string): Promise<UserModel | null> {
        const snapshot = await this.collection.doc(userId).get();
        if (!snapshot.exists) return null;
        return { id: userId, ...snapshot.data() } as UserModel;
    }

    async addSocialLifePoint(userId: string, social: Social) {
        const snapshot = await this.collection.doc(userId).get();
        if (!snapshot.exists) throw new BadRequestError("Invalid user");

        const userInfo = snapshot.data() as UserModel;
        if (userInfo.socialLinks.includes(social))
            throw new BadRequestError("Social already linked");

        userInfo.socialLinks.push(social);
        userInfo.lastRegen =
            userInfo.lifePoints + 1 === USER_MAX_LIFEPOINT
                ? Date.now()
                : userInfo.lastRegen;
        userInfo.lifePoints = Math.min(
            userInfo.lifePoints + 1,
            USER_MAX_LIFEPOINT,
        );

        await this.collection.doc(userId).update({ ...userInfo });
    }

    async getLeaderboard(limit: number = 20) {
        const week = getMondayStartOfWeek();
        const snapshot = await this.collection
            .where("highestPointUpdateTimestamp", ">=", week)
            .orderBy("highestPoint", "desc")
            .orderBy("highestPointUpdateTimestamp", "asc")
            .limit(limit)
            .get();
        if (snapshot.empty) return [];
        return snapshot.docs.map((doc) => {
            const { userEmail, highestPoint } = doc.data() as {
                userEmail: string;
                highestPoint: number;
            };
            return {
                userEmail,
                highestPoint,
            };
        });
    }

    async updateLifePoints() {
        this.collection
            .where("lastRegen", "<=", Date.now() - REGEN_TIME)
            .get()
            .then((response) => {
                const batch = firebaseDb.batch();
                response.docs.forEach((doc) => {
                    const docRef = this.collection.doc(doc.id);
                    const userInfo = doc.data() as UserModel;

                    userInfo.lastRegen =
                        userInfo.lifePoints + 1 === USER_MAX_LIFEPOINT
                            ? Date.now()
                            : userInfo.lastRegen;
                    userInfo.lifePoints = Math.min(
                        userInfo.lifePoints + 1,
                        USER_MAX_LIFEPOINT,
                    );

                    batch.update(docRef, { ...userInfo });
                });
                batch.commit();
            });
    }

    async increaseUserLifePoint(userId: string) {
        const snapshot = await this.collection.doc(userId).get();
        if (!snapshot.exists) throw new BadRequestError("Invalid user");

        const userInfo = snapshot.data() as UserModel;
        if (userInfo.adsWatch >= 3)
            throw new BadRequestError("Exceed ads watch for today");

        userInfo.lastRegen =
            userInfo.lifePoints + 1 === USER_MAX_LIFEPOINT
                ? Date.now()
                : userInfo.lastRegen;
        userInfo.lifePoints = Math.min(
            userInfo.lifePoints + 1,
            USER_MAX_LIFEPOINT,
        );
        userInfo.adsWatch += 1;

        await this.collection.doc(userId).update({ ...userInfo });
    }

    async resetAdsWatch() {
        this.collection.get().then((response) => {
            const batch = firebaseDb.batch();
            response.docs.forEach((doc) => {
                const docRef = this.collection.doc(doc.id);
                batch.update(docRef, { adsWatch: 0 });
            });
            batch.commit();
        });
    }
}

const userRepository = new UserRepository(firebaseDb.collection("user"));
export default userRepository;
