import { Social } from "@shared/constant/config";
import { decryptAddLifePointPayload } from "@shared/helper/decrypt";
import { BadRequestError, NotFoundError } from "@shared/lib/http/httpError";
import { generateTokens, UserTokenPayload } from "@shared/lib/jwt";

import userRepository, { UserRepository } from "./user.repository";

class UserService {
    constructor(private readonly repository: UserRepository) {}

    async login(userEmail: string) {
        let user = await this.repository.findByEmail(userEmail);
        if (!user) user = await this.repository.create(userEmail);

        return generateTokens({
            id: user.id,
            userEmail: user.userEmail,
        });
    }

    async linkSocial(userId: string, social: Social) {
        return await this.repository.addSocialLifePoint(userId, social);
    }

    async getUser(userEmail: string) {
        const user = await this.repository.findByEmail(userEmail);
        if (!user) throw new NotFoundError();

        const { lifePoints, id, lastRegen, socialLinks, adsWatch } = user;
        return { userEmail, lifePoints, id, lastRegen, socialLinks, adsWatch };
    }

    async handleRefreshToken(payload: UserTokenPayload) {
        return generateTokens(payload);
    }

    async addLifePointWatchAds(userId: string, encryptedPayload: string) {
        const payload = decryptAddLifePointPayload(userId, encryptedPayload);
        if (
            !payload ||
            payload.userId !== userId ||
            payload.deadline < Date.now()
        )
            throw new BadRequestError("Invalid payload");
        return await this.repository.increaseUserLifePoint(userId);
    }

    async updateLifePoints() {
        await this.repository.updateLifePoints();
    }

    async resetAdsWatch() {
        await this.repository.resetAdsWatch();
    }
}
const userService = new UserService(userRepository);
export default userService;
