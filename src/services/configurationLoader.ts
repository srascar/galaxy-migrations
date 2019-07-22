import * as YAML from 'yaml';
import { resolve as pathResolve } from 'path';
import { readFileSync } from 'fs';
import { traverseKeysRecursively, snakeToCamelCase } from '../utils';

enum SUPPORTED_CONNECTORS {
    azure_cosmos_db = 'azure_cosmos_db',
}

interface DatabaseConfiguration {
    connector: SUPPORTED_CONNECTORS;
    endpoint: string;
    primaryKey: string;
    name: string;
    container: string;
}

interface Configuration {
    migrationDir: string;
    database: DatabaseConfiguration;
}

const configurationLoader = (
    path: string = 'migrations_config.yml'
): Configuration => {
    const configFileContent = readFileSync(pathResolve(path), 'utf8');
    const config = YAML.parse(configFileContent);

    if (!config.database) {
        throw new Error('Database must be configured');
    }

    return traverseKeysRecursively<Configuration>(config, snakeToCamelCase);
};

export default configurationLoader;
