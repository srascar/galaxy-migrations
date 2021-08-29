import { BaseDatabaseConfiguration, ExecutionSteps, SUPPORTED_CONNECTORS } from './dictionary';
import cosmosExecutionSteps from '../cosmosSpecific/executionSteps';
import { FeedResponse, SqlQuerySpec } from '@azure/cosmos';

const connectorSteps = (config: BaseDatabaseConfiguration): ExecutionSteps<any, any> => {
    switch (config.connector) {
        case SUPPORTED_CONNECTORS.azure_cosmos_db:
            return cosmosExecutionSteps as ExecutionSteps<string | SqlQuerySpec, FeedResponse<any>>;
        case SUPPORTED_CONNECTORS.mongoose:
            return {};
        default:
            throw new Error(`Connector "${config.connector}" is not supported`);
    }
};

export default connectorSteps;