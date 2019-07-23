import * as YAML from 'yaml';
import { resolve as pathResolve } from 'path';
import { readFileSync } from 'fs';
import { traverseKeysRecursively, snakeToCamelCase } from '../utils';
import { isObject } from 'util';
import { Configuration, ALLOWED_KEYS } from './dictionary';

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
        !isObject(config.database) ||
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
