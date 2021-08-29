import batchExecutePromises from '../services/batchExecutePromises';
import { ExecutionSteps, Migration, MIGRATION_WAYS } from '../services/dictionary';

const execute = async (
    steps: ExecutionSteps<unknown, unknown>,
    connector: unknown,
    migration: Migration<unknown>,
    way: MIGRATION_WAYS,
    dryRun = false,
    verbose = false
): Promise<void> => {
    const { query, checkQuery, callback } = steps.getQueries(migration, way);
    console.log(`Starting migration ${migration.versionNumber}`);

    if (!(typeof callback === 'function')) {
        throw new Error(
            `"${way}" attribute must be a function. "${typeof callback}" received`
        );
    }

    if (checkQuery) {
        const checkCount = await steps.executeCheckQuery(
            connector,
            checkQuery,
            migration.queryOptions
        );

        if (checkCount === 0) {
            console.log('Migration not execute because its check count is 0');
            return;
        }
    }

    const response = await steps.executeQuery(
        connector,
        query,
        migration.queryOptions
    );
    const promises = steps.prepareUpdatePromises(
        connector,
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
