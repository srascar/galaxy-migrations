import { SqlQuerySpec } from '@azure/cosmos';
import executeCheckQuery from './executeCheckQuery';
import executeQuery from './executeQuery';
import prepareUpdatePromises from './prepareUpdatePromises';
import { Migration, MIGRATION_WAYS } from '../services/dictionary';

const getQueries = (
    migration: Migration<string | SqlQuerySpec>,
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

export default {
    getQueries,
    executeCheckQuery,
    executeQuery,
    prepareUpdatePromises
};