import logger from "@shared/lib/logger";
import * as dynamoose from "dynamoose";

interface DynamoDBConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    dbName: string;
    endpoint?: string; // Optional for local development
}

class DynamoDBConnection {
    private static instance: DynamoDBConnection;
    private isInitialized: boolean = false;

    private constructor() {}

    public static getInstance(): DynamoDBConnection {
        if (!DynamoDBConnection.instance) {
            DynamoDBConnection.instance = new DynamoDBConnection();
        }
        return DynamoDBConnection.instance;
    }

    public initialize(config: DynamoDBConfig): void {
        if (this.isInitialized) {
            logger.info("DynamoDB connection is already initialized");
            return;
        }

        try {
            // Configure AWS credentials
            const awsConfig = {
                region: config.region,
                credentials: {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                },
            };

            const ddb = new dynamoose.aws.ddb.DynamoDB(awsConfig);

            // Set DynamoDB instance to the Dynamoose DDB instance
            dynamoose.aws.ddb.set(ddb);

            // Set the database name (table prefix)
            if (config.dbName) {
                dynamoose.Table.defaults.set({
                    prefix: `${config.dbName}_`,
                });
            }

            this.isInitialized = true;
            logger.info("DynamoDB connection initialized successfully");
        } catch (error) {
            logger.error("Failed to initialize DynamoDB connection");
            throw error;
        }
    }

    public getConnection(): typeof dynamoose {
        if (!this.isInitialized) {
            throw new Error("DynamoDB connection is not initialized");
        }
        return dynamoose;
    }
}

export { DynamoDBConfig, DynamoDBConnection };
