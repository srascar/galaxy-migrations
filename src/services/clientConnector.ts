import { DatabaseConfiguration, SUPPORTED_CONNECTORS } from './dictionary';
import { Container } from '@azure/cosmos';

const generateAzureCosmosClient = (
    config: DatabaseConfiguration
): Container => {
    const CosmosClient = require('@azure/cosmos').CosmosClient;
    const container = new CosmosClient({
        endpoint: config.endpoint,
        key: config.primaryKey,
    })
        .database(config.name)
        .container(config.container);

    return container;
};

const clientConnector = (config: DatabaseConfiguration): Container => {
    switch (config.connector) {
        case SUPPORTED_CONNECTORS.azure_cosmos_db:
            return generateAzureCosmosClient(config);
        default:
            throw new Error(`Connector "${config.connector}" is not supported`);
    }
};

export default clientConnector;
