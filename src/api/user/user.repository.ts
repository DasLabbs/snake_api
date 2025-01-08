import userModel from "@domain/models/user";
import {
    REGEN_TIME,
    Social,
    USER_MAX_LIFEPOINT,
} from "@shared/constant/config";
import { BadRequestError } from "@shared/lib/http/httpError";
import { ObjectType } from "dynamoose/dist/General";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
    constructor(private readonly model = userModel) {}

    async create(userEmail: string) {
        return await this.model.create({ userEmail, id: uuidv4() });
    }

    async findByEmail(userEmail: string) {
        // Query the user by email
        const result = await this.model.query("userEmail").eq(userEmail).exec();

        const user = result[0]; // Dynamoose queries return an array
        if (!user) return null;

        // Update the user's life points if needed
        if (
            user.lastRegen + REGEN_TIME <= Date.now() &&
            user.lifePoints < USER_MAX_LIFEPOINT
        ) {
            user.lifePoints = Math.min(USER_MAX_LIFEPOINT, user.lifePoints + 1);
            user.lastRegen += REGEN_TIME;

            // Save the updated user
            await user.save();
        }

        return user;
    }

    async findById(userId: string) {
        return await this.model.get(userId);
    }

    async addSocialLifePoint(userId: string, social: Social) {
        const user = await this.findById(userId);
        if (!user) throw new BadRequestError("Invalid user");

        if (user.socialLinks.includes(social))
            throw new BadRequestError("Social already linked");
        user.socialLinks.push(social);
        user.lastRegen =
            user.lifePoints + 1 === USER_MAX_LIFEPOINT
                ? Date.now()
                : user.lastRegen;
        user.lifePoints = Math.min(user.lifePoints + 1, USER_MAX_LIFEPOINT);
        await user.save();
    }

    async updateLifePoints() {
        try {
            const users = await this.model.scan().exec();
            const updatePromises = users.map(async (user) => {
                user.lastRegen =
                    user.lifePoints + 1 === USER_MAX_LIFEPOINT
                        ? Date.now()
                        : user.lastRegen + REGEN_TIME;
                user.lifePoints = Math.min(
                    user.lifePoints + 1,
                    USER_MAX_LIFEPOINT,
                );
                return user.save();
            });

            // Wait for all updates to complete
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Error updating life points:", error);
        }
    }

    async increaseUserLifePoint(userId: string) {
        const user = await this.model.get(userId); // Fetch by primary key
        if (!user || user.adsWatch >= 3) {
            throw new BadRequestError("Invalid operation");
        }

        user.lastRegen =
            user.lifePoints + 1 === USER_MAX_LIFEPOINT
                ? Date.now()
                : user.lastRegen;
        user.lifePoints = Math.min(user.lifePoints + 1, USER_MAX_LIFEPOINT);
        user.adsWatch += 1;

        return await user.save(); // Save the updated user back to the database
    }

    async decreaseUserLifePoint(userId: string) {
        const user = await this.model.get(userId); // Fetch by primary key
        if (!user) {
            throw new BadRequestError("Invalid operation");
        }

        const { lifePoints, lastRegen } = user;
        const updateLastRegen =
            lifePoints === USER_MAX_LIFEPOINT
                ? Date.now()
                : lifePoints === 0
                  ? lastRegen + REGEN_TIME
                  : lastRegen;

        user.lifePoints = Math.max(lifePoints - 1, 0);
        user.lastRegen = updateLastRegen;

        await user.save(); // Save the updated user back to the database
        return user;
    }

    async resetAdsWatch() {
        let lastKey: ObjectType | undefined;

        do {
            const users = await this.model
                .scan()
                .startAt(lastKey as ObjectType)
                .exec();
            const updatePromises = users.map(async (user) => {
                user.adsWatch = 0;
                return user.save();
            });

            await Promise.all(updatePromises);
            lastKey = users.lastKey;
        } while (lastKey);
    }
}

const userRepository = new UserRepository();
export default userRepository;
