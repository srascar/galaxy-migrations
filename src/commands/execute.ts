import { Connection, Migration, MIGRATION_WAYS } from '../services/dictionary';

const execute = (
    connection: Connection,
    migrationVersion: Migration,
    way: MIGRATION_WAYS,
    dryRun = false,
    verbose = false
): void => null;

export default execute;
