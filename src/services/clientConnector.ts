import { Container, CosmosClient } from '@azure/cosmos';
import { DatabaseConfiguration, SUPPORTED_CONNECTORS } from './dictionary';

const connectAzureCosmosContainer = (
    config: DatabaseConfiguration
): Container => {
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
            return connectAzureCosmosContainer(config);
        default:
            throw new Error(`Connector "${config.connector}" is not supported`);
    }
};

export default clientConnector;
