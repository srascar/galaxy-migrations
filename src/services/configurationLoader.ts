import { readFileSync } from 'fs';
import { resolve as pathResolve } from 'path';
import * as YAML from 'yaml';
import { snakeToCamelCase, traverseKeysRecursively } from '../utils';
import { ALLOWED_KEYS, Configuration } from './dictionary';

const configurationLoader = (
    path: string = 'migrations_config.yml'
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

    return traverseKeysRecursively<Configuration>(config, key => {
        if (!ALLOWED_KEYS.includes(key)) {
            throw new Error(`Config key "${key}" is not recognised`);
        }
        return snakeToCamelCase(key);
    });
};

export default configurationLoader;
