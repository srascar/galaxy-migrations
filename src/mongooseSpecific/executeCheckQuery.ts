import { Model, Mongoose } from 'mongoose';

const executeCheckQuery = async (
    container: Mongoose,
    checkQuery: { model: Model<unknown, unknown, unknown>, pipeline: unknown[] },
    queryOptions: unknown
): Promise<number> => {
    const results = await checkQuery.model.aggregate(checkQuery.pipeline);
    if (
        !Array.isArray(results) ||
        results.length !== 1 ||
        !Number.isInteger(results[0].count)
    ) {
        throw new Error(
            `A valid check query pipeline must return $count with the key count. Recieved ${results}`
        );
    }

    return results[0].count;
};

export default executeCheckQuery;
