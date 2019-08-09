import { FeedResponse, Container } from '@azure/cosmos';
import { DocumentMeta, MIGRATION_VERSION_FIELD } from '../services/dictionary';

const prepareUpdatePromises = (
    container: Container,
    response: FeedResponse<any>,
    callback: <T>(item: T, index?: number) => T,
    versionNumber: number,
    documentMeta: DocumentMeta,
    verbose: boolean = false
): Array<() => Promise<any>> => {
    const results = response.resources;
    console.log(`${results.length} items to migrate`);

    if (verbose) {
        console.log('Updated items summary:');
    }

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

        if (verbose) {
            console.log(
                // @ts-ignore: Unreachable code error
                Object.fromEntries([
                    [documentMeta.idField, newItem[documentMeta.idField]],
                    [
                        documentMeta.partitionKey,
                        newItem[documentMeta.partitionKey],
                    ],
                    [MIGRATION_VERSION_FIELD, newItem[MIGRATION_VERSION_FIELD]],
                ])
            );
        }

        // Wrap promises into a function so they are not automatically executed
        return () =>
            container
                .item(
                    newItem[documentMeta.idField],
                    newItem[documentMeta.partitionKey]
                )
                .replace(newItem);
    });
};

export default prepareUpdatePromises;
