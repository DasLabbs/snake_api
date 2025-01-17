import { DynamoDBConfig } from "@domain/db/dynamo";
import * as dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    writeLogFile: boolean;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    encryptKey: string;
    mailPassword: string;
    mailUserName: string;
    dbConfig: DynamoDBConfig;
    timezone: string;
}

const config: Config = {
    port: Number(process.env.PORT ?? "3000"),
    nodeEnv: process.env.NODE_ENV ?? "DEV",
    writeLogFile: process.env.NODE_ENV !== "DEV",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    encryptKey: process.env.ENCRYPT_KEY!,
    mailPassword: process.env.EMAIL_PASSWORD!,
    mailUserName: process.env.EMAIL_USERNAME!,
    dbConfig: {
        accessKeyId: process.env.DB_ACCESS_KEY_ID!,
        dbName: process.env.DB_NAME!,
        region: process.env.DB_REGION!,
        secretAccessKey: process.env.DB_SECRET_ACCESS_KEY!,
    },
    timezone: process.env.TIMEZONE ?? "Asia/Shanghai",
};

export default config;
