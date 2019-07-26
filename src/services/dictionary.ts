const DEFAULT_MIGRATION_DIR = 'migrations';
const MIGRATION_VERSION_FIELD = '_migrationVersion';
const STANDARD_QUERY = 'SELECT * FROM c';
const CHECK_QUERY_TEMPLATE = `SELECT VALUE count(1) FROM c WHERE NOT is_defined(c.c.${MIGRATION_VERSION_FIELD}) OR c.${MIGRATION_VERSION_FIELD}`;

enum SUPPORTED_CONNECTORS {
    azure_cosmos_db = 'azure_cosmos_db',
}

enum MIGRATION_WAYS {
    up = 'up',
    down = 'down',
}

const ALLOWED_KEYS = [
    'migrations_dir',
    'database',
    'connector',
    'endpoint',
    'primary_key',
    'name',
    'container',
];

interface DatabaseConfiguration {
    connector: SUPPORTED_CONNECTORS;
    endpoint: string;
    primaryKey: string;
    name: string;
    container: string;
}

interface Configuration {
    migrationsDir: string;
    database: DatabaseConfiguration;
}

interface Migration {
    queryUp: string;
    up: <T>(item: T) => T;
    checkQueryUp?: string;
    queryDown: string;
    down: <T>(item: T) => T;
    checkQueryDown?: string;
    queryOptions: object;
    versionNumber: number;
}

export {
    DatabaseConfiguration,
    Configuration,
    Migration,
    DEFAULT_MIGRATION_DIR,
    ALLOWED_KEYS,
    SUPPORTED_CONNECTORS,
    MIGRATION_WAYS,
    MIGRATION_VERSION_FIELD,
    STANDARD_QUERY,
    CHECK_QUERY_TEMPLATE,
};
