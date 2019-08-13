import { Container, SqlQuerySpec } from '@azure/cosmos';
import batchExecutePromises from '../cosmosSpecific/batchExecutePromises';
import executeCheckQuery from '../cosmosSpecific/executeCheckQuery';
import executeQuery from '../cosmosSpecific/executeQuery';
import prepareUpdatePromises from '../cosmosSpecific/prepareUpdatePromises';
import { Migration, MIGRATION_WAYS } from '../services/dictionary';

const getQueries = (
    migration: Migration,
    way: MIGRATION_WAYS
): {
    query: string | SqlQuerySpec;
    checkQuery: string | SqlQuerySpec;
    callback: <T>(item: T) => T;
} => {
    return !way || way === MIGRATION_WAYS.up
        ? {
              query: migration.queryUp,
              checkQuery: migration.checkQueryUp,
              callback: migration.up,
          }
        : {
              query: migration.queryDown,
              checkQuery: migration.checkQueryDown,
              callback: migration.down,
          };
};

const execute = async (
    container: Container,
    migration: Migration,
    way: MIGRATION_WAYS,
    dryRun = false,
    verbose = false
): Promise<void> => {
    const { query, checkQuery, callback } = getQueries(migration, way);
    console.log(`Starting migration ${migration.versionNumber}`);

    if (!(typeof callback === 'function')) {
        throw new Error(
            `"${way}" attribute must be a function. "${typeof callback}" received`
        );
    }

    if (checkQuery) {
        const checkCount = await executeCheckQuery(
            container,
            checkQuery,
            migration.queryOptions
        );

        if (checkCount === 0) {
            console.log('Migration not execute because its check count is 0');
            return;
        }
    }

    const response = await executeQuery(
        container,
        query,
        migration.queryOptions
    );
    const promises = prepareUpdatePromises(
        container,
        response,
        callback,
        migration.versionNumber,
        migration.documentMeta,
        verbose
    );

    if (dryRun) {
        return console.log('SUCCESS: Dry run mode');
    }

    await batchExecutePromises(promises);
    console.log('SUCCESS: Items succesfully updated');
};

export default execute;
