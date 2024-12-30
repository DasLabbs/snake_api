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
};

export default config;
