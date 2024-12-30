import gamePlayService from "@api/gamePlay/gamePlay.service";
import logger from "@shared/lib/logger";
import cron from "node-cron";

cron.schedule("0 0 * * 1", async () => {
    logger.info("Cron send ranking report");
    await gamePlayService.sendRankingReport();
});
