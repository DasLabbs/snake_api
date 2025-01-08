import config from "@config/index";

import { DynamoDBConnection } from "./dynamo";

// Initialize the connection
const dbConnection = DynamoDBConnection.getInstance();
dbConnection.initialize(config.dbConfig);
