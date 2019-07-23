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

interface Connection {
    items: any;
    item: any;
}

export {
    DatabaseConfiguration,
    Configuration,
    Connection,
    ALLOWED_KEYS,
    SUPPORTED_CONNECTORS,
    MIGRATION_WAYS,
};
