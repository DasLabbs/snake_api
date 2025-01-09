import gamePlayService from "@api/gamePlay/gamePlay.service";
import config from "@config/index";
import logger from "@shared/lib/logger";
import cron from "node-cron";

cron.schedule(
    "0 18 * * 5",
    async () => {
        logger.info("Cron send ranking report");
        await gamePlayService.sendRankingReport();
    },
    {
        timezone: config.timezone,
    },
);
