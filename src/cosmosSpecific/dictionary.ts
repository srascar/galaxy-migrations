import { BaseDatabaseConfiguration, SUPPORTED_CONNECTORS } from '../services/dictionary';

const ALLOWED_KEYS = [
    'connector',
    'endpoint',
    'primary_key',
    'name',
    'container',
];

interface DatabaseConfiguration extends BaseDatabaseConfiguration {
    connector: SUPPORTED_CONNECTORS;
    endpoint: string;
    primaryKey: string;
    name: string;
    container: string;
}

export {
    DatabaseConfiguration,
    ALLOWED_KEYS,
};
