import gamePlayService from "@api/gamePlay/gamePlay.service";

class HealthCheckService {
    async get() {
        await gamePlayService.sendRankingReport();
        return { hello: "world" };
    }
}

const healthCheckService = new HealthCheckService();
export default healthCheckService;
