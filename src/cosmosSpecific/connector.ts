import { Container, CosmosClient } from '@azure/cosmos';
import { DatabaseConfiguration } from './dictionary';

const azureCosmosConector = (
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

export default azureCosmosConector;