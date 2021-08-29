import { BaseDatabaseConfiguration, SUPPORTED_CONNECTORS } from './dictionary';
import azureCosmosConector from '../cosmosSpecific/connector';
import cosmosConfigurationLoader from '../cosmosSpecific/configurationLoader';
import mongooseConector from '../mongooseSpecific/connector';
import mongooseConfigurationLoader from '../mongooseSpecific/configurationLoader';

const clientConnector = (config: BaseDatabaseConfiguration): any => {
    switch (config.connector) {
        case SUPPORTED_CONNECTORS.azure_cosmos_db:
            return azureCosmosConector(cosmosConfigurationLoader(config));
        case SUPPORTED_CONNECTORS.mongoose:
            return mongooseConector(mongooseConfigurationLoader(config));
        default:
            throw new Error(`Connector "${config.connector}" is not supported`);
    }
};

export default clientConnector;
