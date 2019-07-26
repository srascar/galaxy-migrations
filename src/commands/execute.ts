import { Migration, MIGRATION_WAYS } from '../services/dictionary';
import executeCheckQuery from '../cosmosSpecific/executeCheckQuery';
import { Container } from '@azure/cosmos';

const getQueries = (
    migration: Migration,
    way: MIGRATION_WAYS
): { query: string; checkQuery: string } => {
    return !way || way === MIGRATION_WAYS.up
        ? { query: migration.queryUp, checkQuery: migration.checkQueryUp }
        : {
              query: migration.queryDown,
              checkQuery: migration.checkQueryDown,
          };
};

const execute = async (
    container: Container,
    migration: Migration,
    way: MIGRATION_WAYS,
    dryRun = false,
    verbose = false
): Promise<void> => {
    const { query, checkQuery } = getQueries(migration, way);

    if (checkQuery) {
        const checkCount = await executeCheckQuery(
            container,
            checkQuery,
            migration.queryOptions
        );

        console.log(
            checkCount === 0
                ? 'No need to execute this migration'
                : `${checkCount} documents will be updated by this migration`
        );
    }
};

export default execute;
