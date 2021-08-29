const batchExecutePromises = async (
    promises: Array<() => Promise<unknown>>,
    batchSize = 50
): Promise<void> => {
    let batch = [];
    let i = 0;

    for (const wrappedPromise of promises) {
        batch.push(wrappedPromise());
        i++;

        if (!(i % batchSize)) {
            await Promise.all(batch);
            batch = [];
        }
    }

    await Promise.all(batch);
};

export default batchExecutePromises;
