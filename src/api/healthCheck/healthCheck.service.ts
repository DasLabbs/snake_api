class HealthCheckService {
    async get() {
        return { hello: "world" };
    }
}

const healthCheckService = new HealthCheckService();
export default healthCheckService;
