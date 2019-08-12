jest.mock('@azure/cosmos');
import * as cosmos from '@azure/cosmos';
import execute from './execute';
import { Migration, MIGRATION_WAYS } from '../services/dictionary';

test('should stop if the check count is 0', async () => {
    const container = new cosmos.Container(null, 'id', null);
    container.items.query = jest.fn();
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () => new Promise(resolve => resolve({ resources: [0] })),
    });
    const migration: Migration = {
        checkQueryUp: 'checkQueryUp',
        queryUp: 'queryUp',
        up: item => item,
        queryDown: 'queryDown',
        down: item => item,
        queryOptions: { witness: 'foo' },
        versionNumber: 1,
        documentMeta: { idField: 'id', partitionKey: 'id' },
    };

    await execute(container, migration, MIGRATION_WAYS.up);
    expect(container.items.query).toHaveBeenCalledTimes(1);
    expect(container.items.query).toHaveBeenCalledWith(
        'checkQueryUp',
        migration.queryOptions
    );
});

test('should fetch items if check count is different from 0', async () => {
    const container = new cosmos.Container(null, 'id', null);
    container.items.query = jest.fn();
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () => new Promise(resolve => resolve({ resources: [10] })),
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () =>
            new Promise(resolve =>
                resolve({
                    resources: [],
                })
            ),
    });
    const migration: Migration = {
        checkQueryUp: 'checkQueryUp',
        queryUp: 'queryUp',
        up: item => item,
        queryDown: 'queryDown',
        down: item => item,
        queryOptions: { witness: 'foo' },
        versionNumber: 1,
        documentMeta: { idField: 'id', partitionKey: 'id' },
    };

    await execute(container, migration, MIGRATION_WAYS.up);
    expect(container.items.query).toHaveBeenCalledTimes(2);
    expect(container.items.query).toHaveBeenCalledWith(
        'checkQueryUp',
        migration.queryOptions
    );
    expect(container.items.query).toHaveBeenCalledWith(
        'queryUp',
        migration.queryOptions
    );
});

test('should iterate and apply the migration calback on the loaded items', async () => {
    const container = new cosmos.Container(null, 'id', null);
    container.items.query = jest.fn();
    container.item = jest.fn();
    const replaceCallback = jest.fn();
    // @ts-ignore: Unreachable code error
    container.item.mockReturnValue({
        replace: replaceCallback,
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () => new Promise(resolve => resolve({ resources: [10] })),
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () =>
            new Promise(resolve =>
                resolve({
                    resources: [
                        { name: 'item1' },
                        { name: 'item2' },
                        { name: 'item3' },
                    ],
                })
            ),
    });
    const migration: Migration = {
        checkQueryUp: 'checkQueryUp',
        queryUp: { query: 'queryUp in querySpec format', parameters: [] },
        up: item => ({ ...item, changed: true }),
        queryDown: 'queryDown',
        down: item => item,
        queryOptions: {},
        versionNumber: 1,
        documentMeta: { idField: 'name', partitionKey: 'name' },
    };

    await execute(container, migration, MIGRATION_WAYS.up);
    expect(container.item).toHaveBeenCalledTimes(3);
    expect(container.item).toHaveBeenCalledWith('item1', 'item1');
    expect(container.item).toHaveBeenCalledWith('item2', 'item2');
    expect(container.item).toHaveBeenCalledWith('item3', 'item3');
    expect(replaceCallback).toHaveBeenCalledTimes(3);
    expect(replaceCallback).toHaveBeenCalledWith({
        name: 'item1',
        changed: true,
        _migrationVersion: 1,
    });
    expect(replaceCallback).toHaveBeenCalledWith({
        name: 'item2',
        changed: true,
        _migrationVersion: 1,
    });
    expect(replaceCallback).toHaveBeenCalledWith({
        name: 'item3',
        changed: true,
        _migrationVersion: 1,
    });
});

test('should throw an exception if idField is not found', async () => {
    const container = new cosmos.Container(null, 'id', null);
    container.items.query = jest.fn();
    container.item = jest.fn();
    const replaceCallback = jest.fn();
    // @ts-ignore: Unreachable code error
    container.item.mockReturnValue({
        replace: replaceCallback,
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () => new Promise(resolve => resolve({ resources: [10] })),
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () =>
            new Promise(resolve =>
                resolve({
                    resources: [
                        { name: 'item1' },
                        { invalid: 'item2' },
                        { name: 'item3' },
                    ],
                })
            ),
    });
    const migration: Migration = {
        checkQueryUp: 'checkQueryUp',
        queryUp: { query: 'queryUp in querySpec format', parameters: [] },
        up: item => ({ ...item, changed: true }),
        queryDown: 'queryDown',
        down: item => item,
        queryOptions: {},
        versionNumber: 1,
        documentMeta: { idField: 'name', partitionKey: 'name' },
    };

    let error = null;
    try {
        await execute(container, migration, MIGRATION_WAYS.up);
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(
        new Error(
            'Cannot update item "[object Object]". The key "name" does not exists.'
        )
    );
});

test('should throw an exception if partition key is not found', async () => {
    const container = new cosmos.Container(null, 'id', null);
    container.items.query = jest.fn();
    container.item = jest.fn();
    const replaceCallback = jest.fn();
    // @ts-ignore: Unreachable code error
    container.item.mockReturnValue({
        replace: replaceCallback,
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () => new Promise(resolve => resolve({ resources: [10] })),
    });
    // @ts-ignore: Unreachable code error
    container.items.query.mockReturnValueOnce({
        fetchAll: () =>
            new Promise(resolve =>
                resolve({
                    resources: [
                        { name: 'item1' },
                        { name: 'item2' },
                        { name: 'item3' },
                    ],
                })
            ),
    });
    const migration: Migration = {
        checkQueryUp: 'checkQueryUp',
        queryUp: { query: 'queryUp in querySpec format', parameters: [] },
        up: item => ({ ...item, changed: true }),
        queryDown: 'queryDown',
        down: item => item,
        queryOptions: {},
        versionNumber: 1,
        documentMeta: { idField: 'name', partitionKey: 'unknown' },
    };

    let error = null;
    try {
        await execute(container, migration, MIGRATION_WAYS.up);
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(
        new Error(
            'Cannot update item "[object Object]". The partition key "unknown" does not exists.'
        )
    );
});
