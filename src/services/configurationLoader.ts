import { readFileSync } from 'fs';
import { resolve as pathResolve } from 'path';
import * as YAML from 'yaml';
import { Configuration, SUPPORTED_CONNECTORS } from './dictionary';

const configurationLoader = (
    path = 'migrations_config.yml'
): Configuration => {
    // Fallback to default value when path is null
    const configFileContent = readFileSync(
        pathResolve(path || 'migrations_config.yml'),
        'utf8'
    );
    const config = YAML.parse(configFileContent);

    if (
        !(config.database !== null && typeof config.database === 'object') ||
        (Object.entries(config.database).length === 0 &&
            config.database.constructor === Object)
    ) {
        throw new Error('Database must be configured');
    }

    const supportedConnectors = [SUPPORTED_CONNECTORS.azure_cosmos_db, SUPPORTED_CONNECTORS.mongoose];

    if (!supportedConnectors.includes(config.database.connector)) {
        throw new Error(`Invalid config: unsupported connector ${config.database.connector}`);
    }

    return config;
};

export default configurationLoader;
