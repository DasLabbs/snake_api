import userService from "@api/user/user.service";
import logger from "@shared/lib/logger";
import cron from "node-cron";

cron.schedule("0 0 * * *", async () => {
    logger.info("Cron reset ads watch");
    await userService.resetAdsWatch();
});
