import { Container, FeedResponse } from '@azure/cosmos';

const executeQuery = async (
    container: Container,
    query: string,
    queryOptions: object
): Promise<FeedResponse<any>> =>
    container.items.query(query, queryOptions).fetchAll();

export default executeQuery;
