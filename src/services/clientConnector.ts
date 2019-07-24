import {
    DatabaseConfiguration,
    Connection,
    SUPPORTED_CONNECTORS,
} from './dictionary';

const generateAzureCosmosClient = (
    config: DatabaseConfiguration
): Connection => {
    const CosmosClient = require('@azure/cosmos').CosmosClient;
    const connection = new CosmosClient({
        endpoint: config.endpoint,
        key: config.primaryKey,
    })
        .database(config.name)
        .container(config.container);

    return connection;
};

const clientConnector = (config: DatabaseConfiguration): Connection => {
    switch (config.connector) {
        case SUPPORTED_CONNECTORS.azure_cosmos_db:
            return generateAzureCosmosClient(config);
        default:
            throw new Error(`Connector "${config.connector}" is not supported`);
    }
};

export default clientConnector;
