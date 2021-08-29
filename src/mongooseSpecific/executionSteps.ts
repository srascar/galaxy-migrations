import { Model } from 'mongoose';
import executeCheckQuery from './executeCheckQuery';
import executeQuery from './executeQuery';
import prepareUpdatePromises from './prepareUpdatePromises';
import { Migration, MIGRATION_WAYS } from '../services/dictionary';

const getQueries = (
    migration: Migration<{ model: Model<unknown, unknown, unknown>, pipeline: unknown[] }>,
    way: MIGRATION_WAYS
): {
    query: { model: Model<unknown, unknown, unknown>, pipeline: unknown[] };
    checkQuery: { model: Model<unknown, unknown, unknown>, pipeline: unknown[] };
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