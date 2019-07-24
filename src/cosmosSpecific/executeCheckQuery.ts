import { Connection, Migration } from '../services/dictionary';

const executeCheckQuery = async (
    connection: Connection,
    checkQuery: string,
    migration: Migration
): Promise<number> => {
    const response = await connection.items
        .query(checkQuery, migration.queryOptions)
        .fetchAll();
    const results = response.resources;
    if (
        !Array.isArray(results) ||
        results.length !== 1 ||
        !Number.isInteger(results[0])
    ) {
        throw new Error(
            `Error: A valid check query must return a unique number. Recieved ${results}`
        );
    }

    return results[0];
};

export default executeCheckQuery;
