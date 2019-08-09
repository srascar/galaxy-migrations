jest.mock('@azure/cosmos');
import * as cosmos from '@azure/cosmos';
import prepareUpdatePromises from './prepareUpdatePromises';

test('should return an array of wrapped promises', async () => {
    const container = new cosmos.Container(null, 'id', null);
    const document = { name: 'document' };
    const headers = {};
    const response = new cosmos.FeedResponse([document], headers, false);

    const callback = (item: any) => ({ ...item, transformed: true });

    const wrapedPromises = prepareUpdatePromises(
        container,
        response,
        callback,
        1,
        {
            idField: 'name',
            partitionKey: 'name',
        }
    );

    for await (var wrapedPromise of wrapedPromises) {
        // unwrap the promise
        const promise = wrapedPromise();
        expect(promise).toBeInstanceOf(Promise);
        const result = await promise;
        expect(result).toEqual({
            name: 'document',
            transformed: true,
            _migrationVersion: 1,
        });
    }
});
