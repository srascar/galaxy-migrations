import { ALLOWED_KEYS, DatabaseConfiguration } from './dictionary';
import { snakeToCamelCase, traverseKeys } from '../utils';
import { BaseDatabaseConfiguration } from '../services/dictionary';

const mongooseConfigurationLoader = (config: BaseDatabaseConfiguration): DatabaseConfiguration => {
    return traverseKeys<DatabaseConfiguration>(config as DatabaseConfiguration, key => {
        if (!ALLOWED_KEYS.includes(key)) {
            throw new Error(`Config key "${key}" is not recognised`);
        }
        return snakeToCamelCase(key);
    });
};

export default mongooseConfigurationLoader;