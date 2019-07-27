import { FeedResponse, Container } from '@azure/cosmos';
import { DocumentMeta, MIGRATION_VERSION_FIELD } from '../services/dictionary';

const processResults = (
    container: Container,
    response: FeedResponse<any>,
    callback: <T>(item: T, index?: number) => T,
    versionNumber: number,
    documentMeta: DocumentMeta
): Array<Promise<any>> => {
    const results = response.resources;
    return results.map((item, index) => {
        const newItem = callback(item, index);

        if (!newItem.hasOwnProperty(documentMeta.idField)) {
            throw new Error(
                `Cannot update item "${newItem}". The key "${
                    documentMeta.idField
                }" does not exists.`
            );
        }
        if (!newItem.hasOwnProperty(documentMeta.partitionKey)) {
            throw new Error(
                `Cannot update item "${newItem}". The partition key "${
                    documentMeta.partitionKey
                }" does not exists.`
            );
        }

        newItem[MIGRATION_VERSION_FIELD] = versionNumber;

        return container
            .item(
                newItem[documentMeta.idField],
                newItem[documentMeta.partitionKey]
            )
            .replace(newItem);
    });
};

export default processResults;
