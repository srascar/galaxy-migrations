import { Container, FeedResponse, SqlQuerySpec } from '@azure/cosmos';

const executeQuery = async (
    container: Container,
    query: string | SqlQuerySpec,
    queryOptions: unknown
): Promise<FeedResponse<unknown>> =>
    container.items.query(query, queryOptions).fetchAll();

export default executeQuery;
