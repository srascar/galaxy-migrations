import { Container } from '@azure/cosmos';

const executeCheckQuery = async (
    container: Container,
    checkQuery: string,
    queryOptions: object
): Promise<number> => {
    const response = await container.items
        .query(checkQuery, queryOptions)
        .fetchAll();
    const results = response.resources;
    if (
        !Array.isArray(results) ||
        results.length !== 1 ||
        !Number.isInteger(results[0])
    ) {
        throw new Error(
            `A valid check query must return a unique number. Recieved ${results}`
        );
    }

    return results[0];
};

export default executeCheckQuery;
