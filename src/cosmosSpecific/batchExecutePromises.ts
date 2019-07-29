const batchExecutePromises = async (
    promises: Array<Promise<any>>,
    batchSize: number = 10
) => {
    let batch = [];
    let i = 0;

    for (var promise of promises) {
        batch.push(promise);
        i++;

        if (!(i % batchSize)) {
            await Promise.all(batch);
            batch = [];
        }
    }

    await Promise.all(batch);
};

export default batchExecutePromises;
