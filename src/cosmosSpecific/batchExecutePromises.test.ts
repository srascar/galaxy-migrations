import batchExecutePromises from './batchExecutePromises';

test('should resolve an array of wrapped promisses', async () => {
    let count = 0;
    const generatePromise = () =>
        new Promise<void>(resolve => {
            ++count;
            resolve();
        });
    const promises = [];

    for (let i = 0; i < 42; i++) {
        promises.push(generatePromise);
    }

    await batchExecutePromises(promises, 10);
    expect(count).toBe(42);
});
