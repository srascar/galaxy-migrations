const DEFAULT_MIGRATION_DIR = 'migrations';
const MIGRATION_VERSION_FIELD = '_migrationVersion';
const STANDARD_QUERY = 'SELECT * FROM c';
const CHECK_QUERY_TEMPLATE = `SELECT VALUE count(1) FROM c WHERE NOT \
is_defined(c.${MIGRATION_VERSION_FIELD}) OR c.${MIGRATION_VERSION_FIELD}`;

enum SUPPORTED_CONNECTORS {
    azure_cosmos_db = 'azure_cosmos_db',
    mongoose = 'mongoose',
}

enum MIGRATION_WAYS {
    up = 'up',
    down = 'down',
}

interface BaseDatabaseConfiguration {
    connector: SUPPORTED_CONNECTORS;
}

interface Configuration {
    migrationsDir: string;
    database: BaseDatabaseConfiguration;
}

interface Migration<QueryType> {
    queryUp: QueryType;
    up: <T>(item: T) => T;
    checkQueryUp?: QueryType;
    queryDown: QueryType;
    down: <T>(item: T) => T;
    checkQueryDown?: QueryType;
    queryOptions: unknown;
    versionNumber: number;
    documentMeta?: DocumentMeta;
}

interface DocumentMeta {
    idField: string;
    partitionKey: string;
}

interface ExecutionSteps<QueryType, ResponseType> {
    getQueries: (
        migration: Migration<QueryType>,
        way: MIGRATION_WAYS
    ) => {
        query: QueryType;
        checkQuery: QueryType;
        callback: <T>(item: T) => T;
    };
    executeCheckQuery: <QueryType>(
        connector: unknown,
        checkQuery: QueryType,
        queryOptions: unknown
    ) => Promise<number>;
    executeQuery: <QueryType>(
        connector: unknown,
        query: QueryType,
        queryOptions: unknown
    ) => Promise<ResponseType>;
    prepareUpdatePromises: (
        connector: unknown,
        response: ResponseType,
        callback: <T>(item: T, index?: number) => T,
        versionNumber: number,
        documentMeta?: DocumentMeta,
        verbose?: boolean
    ) => Array<() => Promise<unknown>>;
}

export {
    Configuration,
    BaseDatabaseConfiguration,
    Migration,
    DocumentMeta,
    ExecutionSteps,
    DEFAULT_MIGRATION_DIR,
    SUPPORTED_CONNECTORS,
    MIGRATION_WAYS,
    MIGRATION_VERSION_FIELD,
    STANDARD_QUERY,
    CHECK_QUERY_TEMPLATE,
};
