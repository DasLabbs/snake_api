import userService from "@api/user/user.service";
import logger from "@shared/lib/logger";
import cron from "node-cron";

cron.schedule("*/30 * * * *", async () => {
    logger.info("Cron update lifepoint");
    await userService.updateLifePoints();
});
