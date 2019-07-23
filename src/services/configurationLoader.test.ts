jest.mock('fs');
jest.mock('path');
import * as fs from 'fs';
import { FsEntry } from '../__interfaces__/mockInterfaces';
import configurationLoader from './configurationLoader';

test('should parse the config file and return a valid object', () => {
    const configFile = {
        type: 'file',
        path: 'migrations_config.yml',
        content: `migrations_dir: migrations
database:
    connector: azure_cosmos_db
    endpoint: https://localhost:443/
    primary_key: abcd
    name: my_database
    container: my_container`,
    };
    let fileReferential: Array<FsEntry> = [configFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);

    const config = configurationLoader();
    expect(config).toEqual({
        database: {
            connector: 'azure_cosmos_db',
            container: 'my_container',
            endpoint: 'https://localhost:443/',
            name: 'my_database',
            primaryKey: 'abcd',
        },
        migrationsDir: 'migrations',
    });
});

test('should raise a exception if config contains invalid key', () => {
    const configFile = {
        type: 'file',
        path: 'migrations_config.yml',
        content: `wrong_key_here: migrations
database:
    connector: azure_cosmos_db
    endpoint: https://localhost:443/
    primary_key: abcd
    name: my_database
    container: my_container`,
    };
    let fileReferential: Array<FsEntry> = [configFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);
    expect(() => configurationLoader()).toThrowError(
        'Config key "wrong_key_here" is not recognised'
    );
});

test('should raise a exception if database config is empty', () => {
    const configFile = {
        type: 'file',
        path: 'migrations_config.yml',
        content: `migrations_dir: migrations
database: false`,
    };
    let fileReferential: Array<FsEntry> = [configFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);
    expect(() => configurationLoader()).toThrowError(
        'Database must be configured'
    );
});

test('should raise a exception if config file does not exists', () => {
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential([]);
    expect(() => configurationLoader()).toThrowError(
        'File migrations_config.yml does not exist'
    );
});
